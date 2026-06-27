// server/index.js
// Backend proxy for WildMind AI. Holds the Pexels and Gemini API keys
// SERVER-SIDE (non-VITE_ env vars, never bundled into the browser) and forwards
// requests, so the keys are never exposed to clients.
//
// • GET  /api/pexels?query=...     → { url }  (Pexels image search)
// • POST /api/gemini/profile       → SSE stream (animal summary)
// • POST /api/gemini/chat          → SSE stream (chat)
// In production it also serves the built frontend from /dist.

import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Readable } from 'node:stream'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')

const PORT = process.env.PORT || 3001
const PEXELS_API_KEY = process.env.PEXELS_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

// Groq is a free, fast backup LLM. If Gemini fails (overload / quota / down),
// we fall back to Groq so the live site keeps working. Key is server-side only.
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

const app = express()
app.use(express.json({ limit: '1mb' }))

// ── Basic abuse protection ────────────────────────────────────────────
// The AI endpoints are public and spend YOUR Gemini/Groq quota, so cap how
// often and how much any single visitor can send. In-memory is fine for a
// single-instance Space; swap for a shared store if you ever scale out.
app.set('trust proxy', true)

const RATE_WINDOW_MS = 60_000 // 1 minute
const RATE_MAX = 20 // AI requests per IP per window
const MAX_MSG_LEN = 2000 // chars per chat message
const MAX_HISTORY = 16 // most recent messages kept
const MAX_NAME_LEN = 80 // chars for an animal name

const rateHits = new Map() // ip -> { count, resetAt }
function rateLimit(req, res, next) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  let rec = rateHits.get(ip)
  if (!rec || now > rec.resetAt) {
    rec = { count: 0, resetAt: now + RATE_WINDOW_MS }
    rateHits.set(ip, rec)
  }
  rec.count++
  if (rec.count > RATE_MAX) {
    const retry = Math.ceil((rec.resetAt - now) / 1000)
    res.setHeader('Retry-After', String(retry))
    return res.status(429).json({ error: `You're sending requests too quickly. Please wait ${retry}s and try again.` })
  }
  next()
}
// Drop stale buckets so the map can't grow without bound.
setInterval(() => {
  const now = Date.now()
  for (const [ip, rec] of rateHits) if (now > rec.resetAt) rateHits.delete(ip)
}, RATE_WINDOW_MS).unref?.()

// ── Pexels image proxy ────────────────────────────────────────────────
app.get('/api/pexels', async (req, res) => {
  const query = String(req.query.query || '').trim()
  if (!PEXELS_API_KEY) return res.json({ url: FALLBACK_IMAGE })
  try {
    const url =
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + ' animal')}` +
      `&per_page=1&orientation=landscape`
    const r = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } })
    if (!r.ok) return res.json({ url: FALLBACK_IMAGE })
    const data = await r.json()
    const photo = data.photos?.[0]
    res.json({ url: photo?.src?.large2x || photo?.src?.large || FALLBACK_IMAGE })
  } catch {
    res.json({ url: FALLBACK_IMAGE })
  }
})

// ── Gemini prompt definitions (kept server-side) ──────────────────────
const PROFILE_SYSTEM = {
  parts: [{ text: 'You are an expert wildlife biologist and naturalist.' }],
}

const CHAT_SYSTEM = {
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

function profilePrompt(animalName) {
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
// Returns true if it handled the response, false if it couldn't start (so the
// caller can still send a normal error). Key safety: GROQ_API_KEY stays server-side.
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
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Parse Groq's OpenAI-style SSE and translate each token into the Gemini shape
  // the frontend already understands: data: {candidates:[{content:{parts:[{text}]}}]}
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
async function streamGemini(res, contents, systemInstruction, generationConfig) {
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
        // thinkingBudget 0 disables 2.5-flash "thinking" so output isn't truncated.
        generationConfig: { temperature: 0.7, thinkingConfig: { thinkingBudget: 0 }, ...generationConfig },
      }),
    })
  } catch (err) {
    if (await streamGroq(res, contents, systemInstruction, generationConfig)) return
    return res.status(502).json({ error: `Could not reach Gemini: ${err.message}` })
  }

  if (!upstream.ok) {
    // Gemini failed (overload / quota / etc.) — try the Groq fallback before erroring.
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

  // Pipe the raw SSE stream straight through to the client.
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  Readable.fromWeb(upstream.body).pipe(res)
}

app.post('/api/gemini/profile', rateLimit, (req, res) => {
  const animalName = String(req.body?.animalName || '').trim().slice(0, MAX_NAME_LEN)
  if (!animalName) return res.status(400).json({ error: 'animalName is required.' })
  const contents = [{ role: 'user', parts: [{ text: profilePrompt(animalName) }] }]
  streamGemini(res, contents, PROFILE_SYSTEM, { maxOutputTokens: 600 })
})

app.post('/api/gemini/chat', rateLimit, (req, res) => {
  const raw = Array.isArray(req.body?.messages) ? req.body.messages : []
  // Keep only the most recent messages, and cap each one's length, to bound tokens.
  const messages = raw.slice(-MAX_HISTORY)
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content || '').slice(0, MAX_MSG_LEN) }],
  }))
  if (!contents.length) return res.status(400).json({ error: 'messages is required.' })
  streamGemini(res, contents, CHAT_SYSTEM, { maxOutputTokens: 1024 })
})

// ── Serve the built frontend in production ────────────────────────────
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(path.join(DIST, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`🌿 WildMind API proxy running at http://localhost:${PORT}`)
  console.log(`   Pexels: ${PEXELS_API_KEY ? 'configured' : 'MISSING'} · Gemini: ${GEMINI_API_KEY ? 'configured' : 'MISSING'} (${GEMINI_MODEL}) · Groq fallback: ${GROQ_API_KEY ? 'configured' : 'off'} (${GROQ_MODEL})`)
})
