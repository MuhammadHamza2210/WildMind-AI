// services/ollama.js
// Streaming client for a locally running Ollama instance (model: llama3.2:1b).
// Ollama's /api/generate endpoint returns newline-delimited JSON (NDJSON).
// Each line looks like: {"response": "token", "done": false}

const OLLAMA_URL = 'http://localhost:11434/api/generate'
// Speed > size on CPU. 'llama3.2:1b' (1.3 GB) is the fastest. For richer (but
// noticeably slower) profiles, swap to 'llama3.2:3b' or 'llama3.1'.
const MODEL = 'llama3.2:1b'

// Keep the model resident in RAM between requests so there's no cold-start
// reload lag once the first request has warmed it up.
const KEEP_ALIVE = '30m'

/**
 * Low-level helper that POSTs a prompt to Ollama and streams the NDJSON
 * response, invoking onChunk(token) per token and onDone() when finished.
 *
 * @param {string} prompt        Full prompt to send to the model.
 * @param {(token: string) => void} onChunk  Called for each streamed token.
 * @param {() => void} onDone     Called once when the stream completes.
 * @param {object} [options]      Optional Ollama generation options.
 */
async function streamGenerate(prompt, onChunk, onDone, options = {}) {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: true,
      keep_alive: KEEP_ALIVE,
      options: {
        temperature: 0.7,
        // Cap output length so generation finishes quickly on CPU.
        num_predict: 512,
        ...options,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Ollama request failed (${response.status}). Is Ollama running on localhost:11434 with "${MODEL}" pulled?`
    )
  }

  if (!response.body) {
    throw new Error('Ollama returned an empty response body (no stream).')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // NDJSON: split on newlines, keep any trailing partial line in the buffer.
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      try {
        const json = JSON.parse(trimmed)
        if (json.response) onChunk(json.response)
        if (json.done) {
          onDone()
          return
        }
      } catch {
        // Ignore malformed partial lines — they'll complete on a later read.
      }
    }
  }

  // Flush any remaining buffered JSON once the stream ends.
  const tail = buffer.trim()
  if (tail) {
    try {
      const json = JSON.parse(tail)
      if (json.response) onChunk(json.response)
    } catch {
      /* no-op */
    }
  }

  onDone()
}

/**
 * Stream a SHORT AI summary for an animal — 2-3 tight paragraphs.
 * The structured taxonomy/facts come instantly from the curated dataset, so
 * the AI's job here is a brief, vivid narrative that finishes fast on CPU.
 */
export async function streamAnimalProfile(animalName, onChunk, onDone) {
  const prompt =
    `You are an expert wildlife biologist. ` +
    `If "${animalName}" is not a real animal or living creature, do NOT invent a ` +
    `profile — reply with exactly one line: ` +
    `"🌿 \\"${animalName}\\" doesn't look like an animal I can profile — try a species like the Snow Leopard or Blue Whale." ` +
    `Otherwise, write a short, friendly profile of the ` +
    `${animalName}. Organize it into 3 to 4 short sections. Each section MUST start ` +
    `with a Markdown "## " heading written in simple, plain words (for example: ` +
    `"## Meet the Animal", "## Where It Lives", "## How It Behaves", "## Cool Facts"), ` +
    `followed by 1 to 2 short sentences of content. Use simple, everyday English that ` +
    `anyone can understand — like explaining to a curious 12-year-old. Use short ` +
    `sentences and common words; avoid jargon (if you must use a scientific term, ` +
    `explain it simply). Keep the whole thing under about 160 words. Do not write any ` +
    `intro or outro outside the sections.`

  // A bit more room for the section headings + content.
  return streamGenerate(prompt, onChunk, onDone, { num_predict: 380 })
}

/**
 * Fire-and-forget warm-up: loads the model into RAM so the first real request
 * doesn't pay the cold-start cost. Safe to call when the app mounts.
 */
export async function warmModel() {
  try {
    await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt: 'Hi',
        stream: false,
        keep_alive: KEEP_ALIVE,
        options: { num_predict: 1 },
      }),
    })
  } catch {
    // Ollama may be offline — ignore; real requests will surface the error.
  }
}

/**
 * Stream a chat response. Accepts a conversation history as an array of
 * { role: 'user' | 'assistant', content } and bakes in the WildMind persona.
 */
export async function streamChat(messages, onChunk, onDone) {
  const systemPrompt =
    `You are WildMind, an expert AI wildlife biologist and naturalist. ` +
    `You ONLY answer questions about the living natural world: wild animals, their ` +
    `biology and behaviour, ecosystems, habitats, biodiversity, conservation, ` +
    `endangered species, plants, fungi, and the environment or climate as it relates ` +
    `to wildlife. ` +
    `If a question is outside this scope (e.g. physics, maths, history, politics, ` +
    `technology, coding, celebrities, human medicine, or general trivia like ` +
    `"what is gravity" or "what is an electron"), DO NOT answer it. Instead reply with ` +
    `exactly one short, friendly sentence (under 40 words), starting with 🌿, saying it ` +
    `is outside your wildlife focus and suggesting an example wildlife question instead. ` +
    `When the question IS about wildlife, answer with accuracy and enthusiasm. ` +
    `Write in simple, everyday English that anyone can understand — like explaining ` +
    `to a curious 12-year-old. Use short sentences and common words; avoid jargon ` +
    `(if a scientific term is needed, explain it in plain words). ` +
    `Format answers in clean Markdown: a short direct opening sentence, ` +
    `"## " headings for longer answers, bullet (- ) or numbered (1. ) lists for ` +
    `multiple items, **bold** key terms, *italic* scientific names, and short ` +
    `paragraphs separated by blank lines. Do not wrap the whole reply in a code block.`

  // Flatten the conversation history into a single prompt for /api/generate.
  const transcript = messages
    .map((m) => (m.role === 'user' ? `User: ${m.content}` : `WildMind: ${m.content}`))
    .join('\n\n')

  const prompt = `${systemPrompt}\n\n${transcript}\n\nWildMind:`

  return streamGenerate(prompt, onChunk, onDone)
}
