// services/gemini.js
// Thin client for the Gemini backend proxy (/api/gemini/*). The API key, model
// name, prompts and system instructions all live SERVER-SIDE (see server/index.js),
// so nothing secret ships to the browser. This file just streams the SSE response.

/**
 * POST to an SSE endpoint and emit text tokens as they arrive.
 *
 * @param {string} endpoint
 * @param {object} body
 * @param {(token: string) => void} onChunk
 * @param {() => void} onDone
 */
async function streamSSE(endpoint, body, onChunk, onDone) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    let detail = ''
    try {
      const j = await response.json()
      detail = j?.error || ''
    } catch {
      /* ignore */
    }
    throw new Error(detail || `AI request failed (${response.status}).`)
  }

  if (!response.body) {
    throw new Error('AI returned an empty response stream.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const payload = trimmed.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const json = JSON.parse(payload)
        const parts = json.candidates?.[0]?.content?.parts || []
        const text = parts.map((p) => p.text || '').join('')
        if (text) onChunk(text)
      } catch {
        // Partial JSON across reads — completes on a later chunk.
      }
    }
  }

  onDone()
}

/**
 * Stream a short AI summary for an animal via the proxy.
 */
export async function streamAnimalProfile(animalName, onChunk, onDone) {
  return streamSSE('/api/gemini/profile', { animalName }, onChunk, onDone)
}

/**
 * Stream a chat response via the proxy.
 * @param {Array<{role:'user'|'assistant', content:string}>} messages
 */
export async function streamChat(messages, onChunk, onDone) {
  return streamSSE('/api/gemini/chat', { messages }, onChunk, onDone)
}

/**
 * No-op for API parity with the Ollama backend — cloud models need no warm-up.
 */
export async function warmModel() {
  /* Gemini runs server-side; nothing to pre-load. */
}
