// api/gemini/profile.js — Vercel serverless function
// POST /api/gemini/profile  → SSE stream (animal profile), Gemini with Groq fallback.

import { streamGemini, profilePrompt, PROFILE_SYSTEM, MAX_NAME_LEN } from '../../lib/ai.js'

// Allow enough time for the streamed LLM response (Hobby plan max is 60s).
export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })
  const animalName = String(req.body?.animalName || '').trim().slice(0, MAX_NAME_LEN)
  if (!animalName) return res.status(400).json({ error: 'animalName is required.' })
  const contents = [{ role: 'user', parts: [{ text: profilePrompt(animalName) }] }]
  await streamGemini(res, contents, PROFILE_SYSTEM, { maxOutputTokens: 600 })
}
