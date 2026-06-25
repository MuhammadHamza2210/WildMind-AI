// pages/ChatPage.jsx
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles, AlertTriangle } from 'lucide-react'
import { streamChat, AI_PROVIDER, FALLBACK_ENABLED } from '../services/ai'
import StreamingText from '../components/StreamingText'

const STARTERS = [
  "What's the deadliest animal on Earth?",
  'How do wolves communicate?',
  'Why are bees so important?',
  'What is the largest animal ever?',
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-accent animate-bounce-dot"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]) // { role: 'user' | 'assistant', content }
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const [usedFallback, setUsedFallback] = useState(false)
  const scrollRef = useRef(null)

  // Auto-scroll to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isStreaming])

  const send = async (textToSend) => {
    const content = (textToSend ?? input).trim()
    if (!content || isStreaming) return

    setError(null)
    setInput('')

    const userMsg = { role: 'user', content }
    // Build the history we'll send to the model (includes the new user message).
    const history = [...messages, userMsg]

    // Add the user message + an empty assistant placeholder we'll stream into.
    setMessages([...history, { role: 'assistant', content: '' }])
    setIsStreaming(true)

    try {
      await streamChat(
        history,
        (token) => {
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            next[next.length - 1] = { ...last, content: last.content + token }
            return next
          })
        },
        () => setIsStreaming(false),
        () => setUsedFallback(true) // Gemini failed → fell back to Ollama
      )
    } catch (err) {
      setIsStreaming(false)
      setError(err.message || 'The AI model could not be reached.')
      // Drop the empty assistant placeholder on failure.
      setMessages((prev) => {
        const next = [...prev]
        if (next.length && next[next.length - 1].role === 'assistant' && !next[next.length - 1].content) {
          next.pop()
        }
        return next
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send()
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold text-text-primary sm:text-4xl">
          <Sparkles className="text-accent" /> Chat with WildMind
        </h1>
        <p className="mt-2 text-text-muted">
          Your personal AI naturalist. Ask anything about the natural world.
        </p>
        {usedFallback && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-btn border border-amber/30 bg-amber/10 px-3 py-1.5 text-xs text-amber">
            <Sparkles size={13} /> Gemini was busy (rate limit) — now using the local model.
          </div>
        )}
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-card pr-1"
      >
        {isEmpty && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/25">
              <Sparkles size={28} className="text-accent" />
            </div>
            <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">
              Ask me anything about wildlife
            </h2>
            <p className="mb-8 max-w-md text-text-muted">
              From the deepest oceans to the highest peaks — let’s explore the living world together.
            </p>
            <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
              {STARTERS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="glass glass-hover px-4 py-3 text-left text-sm text-text-primary"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'user'
          const isLast = i === messages.length - 1
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-card px-4 py-3 text-[15px] leading-relaxed sm:max-w-[75%] ${
                  isUser
                    ? 'whitespace-pre-wrap border border-accent/30 bg-accent/10 text-text-primary'
                    : 'glass text-text-primary'
                }`}
              >
                {isUser ? (
                  msg.content
                ) : msg.content ? (
                  <StreamingText text={msg.content} isStreaming={isLast && isStreaming} />
                ) : isLast && isStreaming ? (
                  <TypingDots />
                ) : (
                  ''
                )}
              </div>
            </motion.div>
          )
        })}

        {error && (
          <div className="flex items-start gap-2 rounded-card border border-status-critical/30 bg-status-critical/5 p-4 text-sm text-text-muted">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-status-critical" />
            <div>
              <p className="font-semibold text-status-critical">Couldn’t reach the AI model</p>
              <p>{error}</p>
              {FALLBACK_ENABLED ? (
                <p className="mt-1">
                  Gemini is unavailable (often a rate limit) and the local Ollama fallback isn’t
                  reachable. Start Ollama:
                  <code className="ml-1 rounded bg-white/5 px-1.5 py-0.5 text-accent">
                    ollama run llama3.2:1b
                  </code>
                </p>
              ) : AI_PROVIDER === 'ollama' ? (
                <p className="mt-1">
                  Ensure Ollama is running:
                  <code className="ml-1 rounded bg-white/5 px-1.5 py-0.5 text-accent">
                    ollama run llama3.2:1b
                  </code>
                </p>
              ) : (
                <p className="mt-1">
                  Check that{' '}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-accent">
                    VITE_GEMINI_API_KEY
                  </code>{' '}
                  is set in your <code>.env</code> file.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div
          className="glass flex items-end gap-3 p-2.5"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            rows={1}
            placeholder="Ask about any animal, ecosystem, or conservation topic…"
            className="max-h-32 w-full resize-none bg-transparent px-2 py-2 text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-accent text-background transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-text-muted">
          WildMind can make mistakes. Verify critical facts with primary sources.
        </p>
      </form>
    </div>
  )
}
