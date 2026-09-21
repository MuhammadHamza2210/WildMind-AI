// api/gemini/chat.js — Vercel serverless function
// POST /api/gemini/chat  → SSE stream (chat), Gemini with Groq fallback.

import { streamGemini, CHAT_SYSTEM, MAX_HISTORY, MAX_MSG_LEN } from '../../lib/ai.js'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })
  const raw = Array.isArray(req.body?.messages) ? req.body.messages : []
  // Keep only the most recent messages, and cap each one's length, to bound tokens.
  const messages = raw.slice(-MAX_HISTORY)
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content || '').slice(0, MAX_MSG_LEN) }],
  }))
  if (!contents.length) return res.status(400).json({ error: 'messages is required.' })
  await streamGemini(res, contents, CHAT_SYSTEM, { maxOutputTokens: 1024 })
}
