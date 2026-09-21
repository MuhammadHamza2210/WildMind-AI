// lib/ai.js
// Shared server-side AI logic for the Vercel serverless functions in /api.
// Ported from the original Express server (server/index.js) — keeps the Pexels,
// Gemini and Groq keys SERVER-SIDE (non-VITE_ env vars) so they never reach the
// browser. Streams Gemini SSE straight through, with a Groq fallback that is
// re-emitted in the same Gemini SSE shape the frontend already understands.

import { Readable } from 'node:stream'

const PEXELS_API_KEY = process.env.PEXELS_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

// Input caps (the real abuse protection now that we're serverless).
export const MAX_MSG_LEN = 2000
export const MAX_HISTORY = 16
export const MAX_NAME_LEN = 80

// ── Prompt definitions (kept server-side) ─────────────────────────────
export const PROFILE_SYSTEM = {
  parts: [{ text: 'You are an expert wildlife biologist and naturalist.' }],
}

export const CHAT_SYSTEM = {
  parts: [
    {
      text:
        'You are WildMind, an expert AI wildlife biologist and naturalist.\n\n' +
        'SCOPE — you ONLY answer questions about the living natural world: wild ' +
        'animals, their biology and behaviour, ecosystems, habitats, biodiversity, ' +
        'conservation, endangered species, plants, fungi, and the environment or ' +
        'climate as it relates to wildlife.\n\n' +
        'If a question is outside this scope — for example physics, chemistry, maths, ' +
        'history, politics, technology, coding, sports, celebrities, human medicine, or ' +
        'general trivia (e.g. "what is gravity", "what is an electron") — DO NOT answer ' +
        'it and do not explain it even partially. Instead reply with exactly ONE short, ' +
        'friendly sentence (under 40 words) that politely says it is outside your ' +
        'wildlife focus, then suggest an example wildlife question to ask instead. ' +
        'Start that reply with the 🌿 emoji. Questions that genuinely connect to nature ' +
        '(such as how animals sense Earth\'s magnetic field, or how climate change ' +
        'affects habitats) ARE in scope and should be answered normally.\n\n' +
        'When the question IS in scope, answer with accuracy and enthusiasm.\n\n' +
        'Write in simple, everyday English that anyone can understand — like ' +
        'explaining to a curious 12-year-old. Use short sentences and common words, ' +
        'and avoid jargon (if a scientific term is needed, explain it in plain words).\n\n' +
        'Format every answer in clean Markdown:\n' +
        '- Open with a short 1-2 sentence direct answer.\n' +
        '- Use "## " or "### " headings to organise longer answers.\n' +
        '- Use bullet points (- ) or numbered lists (1. ) for multiple items or steps.\n' +
        '- **Bold** key terms and put *scientific names* in italics.\n' +
        '- Keep paragraphs short (2-3 sentences) with blank lines between blocks.\n' +
        'Do not wrap the whole reply in a code block.',
    },
  ],
}

export function profilePrompt(animalName) {
  return (
    `If "${animalName}" is not a real animal or living creature (for example a ` +
    `concept, object, person, or place), do NOT invent a profile. Instead reply with ` +
    `exactly one line and nothing else: ` +
    `"🌿 \\"${animalName}\\" doesn't look like an animal I can profile — try a species like the Snow Leopard or Blue Whale." ` +
    `Otherwise, write a short, friendly profile of the ${animalName}. ` +
    `Organize it into 3 to 4 short sections. Each section MUST start with a ` +
    `Markdown "## " heading written in simple, plain words (for example: ` +
    `"## Meet the Animal", "## Where It Lives", "## How It Behaves", ` +
    `"## Cool Facts"), followed by 1 to 2 short sentences of content. ` +
    `Use simple, everyday English that anyone can understand — like explaining to ` +
    `a curious 12-year-old. Use short sentences and common words; avoid jargon ` +
    `(if you must use a scientific term, explain it simply). ` +
    `Keep the whole thing under about 160 words. ` +
    `Do not write any intro or outro outside the sections.`
  )
}

// ── Pexels image proxy ────────────────────────────────────────────────
export async function pexelsImage(query) {
  if (!PEXELS_API_KEY) return FALLBACK_IMAGE
  try {
    const url =
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(String(query || '') + ' animal')}` +
      `&per_page=1&orientation=landscape`
    const r = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } })
    if (!r.ok) return FALLBACK_IMAGE
    const data = await r.json()
    const photo = data.photos?.[0]
    return photo?.src?.large2x || photo?.src?.large || FALLBACK_IMAGE
  } catch {
    return FALLBACK_IMAGE
  }
}

// Convert Gemini-style contents + systemInstruction into OpenAI/Groq messages.
function toGroqMessages(contents, systemInstruction) {
  const messages = []
  const sysText =
    typeof systemInstruction === 'string'
      ? systemInstruction
      : systemInstruction?.parts?.map((p) => p.text || '').join('') || ''
  if (sysText) messages.push({ role: 'system', content: sysText })
  for (const c of contents || []) {
    const text = (c.parts || []).map((p) => p.text || '').join('')
    messages.push({ role: c.role === 'model' ? 'assistant' : 'user', content: text })
  }
  return messages
}

// ── Groq fallback: streams Groq output, re-emitted in the Gemini SSE shape ──
async function streamGroq(res, contents, systemInstruction, generationConfig) {
  if (!GROQ_API_KEY) return false
  let upstream
  try {
    upstream = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: toGroqMessages(contents, systemInstruction),
        stream: true,
        temperature: generationConfig?.temperature ?? 0.7,
        max_tokens: generationConfig?.maxOutputTokens ?? 1024,
      }),
    })
  } catch {
    return false
  }
  if (!upstream.ok || !upstream.body) return false

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.flushHeaders?.()

  let buffer = ''
  for await (const chunk of Readable.fromWeb(upstream.body)) {
    buffer += chunk.toString('utf8')
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const t = line.trim()
      if (!t.startsWith('data:')) continue
      const payload = t.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const j = JSON.parse(payload)
        const text = j.choices?.[0]?.delta?.content || ''
        if (text) {
          res.write(`data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] })}\n\n`)
        }
      } catch {
        /* partial JSON across reads */
      }
    }
  }
  res.end()
  return true
}

// ── Shared Gemini streaming helper (with Groq fallback) ───────────────
export async function streamGemini(res, contents, systemInstruction, generationConfig) {
  if (!GEMINI_API_KEY) {
    if (await streamGroq(res, contents, systemInstruction, generationConfig)) return
    return res.status(503).json({ error: 'No AI backend is configured on the server.' })
  }

  const url = `${GEMINI_BASE}/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`
  let upstream
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction,
        generationConfig: { temperature: 0.7, thinkingConfig: { thinkingBudget: 0 }, ...generationConfig },
      }),
    })
  } catch (err) {
    if (await streamGroq(res, contents, systemInstruction, generationConfig)) return
    return res.status(502).json({ error: `Could not reach Gemini: ${err.message}` })
  }

  if (!upstream.ok) {
    console.warn(`Gemini failed (${upstream.status}); trying Groq fallback...`)
    if (await streamGroq(res, contents, systemInstruction, generationConfig)) return
    let detail = ''
    try {
      const j = await upstream.json()
      detail = j?.error?.message || ''
    } catch {
      /* ignore */
    }
    return res
      .status(upstream.status)
      .json({ error: `Gemini request failed (${upstream.status}).${detail ? ' ' + detail : ''}` })
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.flushHeaders?.()
  Readable.fromWeb(upstream.body).pipe(res)
}
