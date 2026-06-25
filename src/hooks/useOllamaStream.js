// hooks/useOllamaStream.js
import { useCallback, useRef, useState } from 'react'

/**
 * Manages a token-by-token streaming session against Ollama.
 *
 * Usage:
 *   const { text, isStreaming, error, startStream, reset } = useOllamaStream()
 *   startStream((onChunk, onDone) => streamAnimalProfile(name, onChunk, onDone))
 *
 * The `runner` callback receives (onChunk, onDone) and should wire them to a
 * service function from services/ollama.js.
 */
export function useOllamaStream() {
  const [text, setText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  // Guard against state updates after reset/unmount mid-stream.
  const activeRef = useRef(false)

  const reset = useCallback(() => {
    activeRef.current = false
    setText('')
    setError(null)
    setIsStreaming(false)
  }, [])

  const startStream = useCallback(async (runner) => {
    setText('')
    setError(null)
    setIsStreaming(true)
    activeRef.current = true

    const onChunk = (token) => {
      if (!activeRef.current) return
      setText((prev) => prev + token)
    }
    const onDone = () => {
      if (!activeRef.current) return
      setIsStreaming(false)
      activeRef.current = false
    }

    try {
      await runner(onChunk, onDone)
    } catch (err) {
      if (!activeRef.current) return
      setError(err.message || 'Streaming failed.')
      setIsStreaming(false)
      activeRef.current = false
    }
  }, [])

  return { text, isStreaming, error, startStream, reset }
}
