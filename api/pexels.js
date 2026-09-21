// api/pexels.js — Vercel serverless function
// GET /api/pexels?query=...  → { url }  (Pexels image search, key stays server-side)

import { pexelsImage } from '../lib/ai.js'

export default async function handler(req, res) {
  const query = String(req.query?.query || '').trim()
  const url = await pexelsImage(query)
  res.status(200).json({ url })
}
