// services/ai.js
// Single entry point for AI features with automatic failover.
//
// Backend selection:
//   • Gemini via the backend proxy (/api/gemini/*) — the default
//   • Ollama (local, offline) when forced with VITE_AI_PROVIDER=ollama
// The Gemini key lives server-side (see server/index.js), so the client can't
// "see" it — it simply calls the proxy and falls back to Ollama if it fails.
//
// Failover: when Gemini is the primary backend and a request fails BEFORE any
// text has streamed (e.g. a 429 quota error, or the proxy isn't running), the
// same request is retried on local Ollama automatically.

import * as ollama from './ollama'
import * as gemini from './gemini'

const forced = import.meta.env.VITE_AI_PROVIDER

export const AI_PROVIDER = forced === 'ollama' ? 'ollama' : 'gemini'

const PRIMARY = AI_PROVIDER === 'gemini' ? gemini : ollama
// Ollama is the safety net whenever Gemini is primary.
const FALLBACK = AI_PROVIDER === 'gemini' ? ollama : null

export const FALLBACK_ENABLED = !!FALLBACK

// Tracks which backend actually served the last request (for optional UI hints).
let lastBackend = AI_PROVIDER
export const getLastBackend = () => lastBackend

/**
 * Wrap a (arg, onChunk, onDone) streamer so that if the primary backend throws
 * before emitting any tokens, the request is transparently retried on Ollama.
 */
function withFailover(primaryFn, fallbackFn, label) {
  return async (arg, onChunk, onDone, onFallback) => {
    if (!fallbackFn) {
      lastBackend = AI_PROVIDER
      return primaryFn(arg, onChunk, onDone)
    }

    let emitted = false
    const guardedChunk = (token) => {
      emitted = true
      onChunk(token)
    }

    try {
      lastBackend = 'gemini'
      await primaryFn(arg, guardedChunk, onDone)
    } catch (err) {
      // If Gemini already streamed text, don't restart — would duplicate output.
      if (emitted) throw err

      console.warn(
        `[WildMind] Gemini ${label} failed (${err?.message || err}). Falling back to local Ollama.`
      )
      lastBackend = 'ollama'
      if (typeof onFallback === 'function') onFallback(err)
      return fallbackFn(arg, onChunk, onDone)
    }
  }
}

export const streamAnimalProfile = withFailover(
  PRIMARY.streamAnimalProfile,
  FALLBACK?.streamAnimalProfile,
  'profile'
)

export const streamChat = withFailover(PRIMARY.streamChat, FALLBACK?.streamChat, 'chat')

export const warmModel = PRIMARY.warmModel
