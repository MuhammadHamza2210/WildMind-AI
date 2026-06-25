// components/StreamingText.jsx
// Renders streamed text as lightweight markdown — headings, bold, italic,
// inline code, bullet + numbered lists, and blockquotes — using a small
// regex-based parser (no external markdown library).

/**
 * Render inline markdown (**bold**, *italic*, `code`) to React nodes.
 */
function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`)/g)
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (!part) return null
    if (/^\*\*[\s\S]+\*\*$/.test(part) || /^__[\s\S]+__$/.test(part)) {
      return <strong key={key}>{part.slice(2, -2)}</strong>
    }
    if (/^`[^`]+`$/.test(part)) {
      return (
        <code key={key} className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-accent">
          {part.slice(1, -1)}
        </code>
      )
    }
    if (/^\*[^*\n]+\*$/.test(part) || /^_[^_\n]+_$/.test(part)) {
      return <em key={key}>{part.slice(1, -1)}</em>
    }
    return <span key={key}>{part}</span>
  })
}

/**
 * Parse a markdown string into block-level React elements.
 */
function renderMarkdown(text) {
  const lines = text.split('\n')
  const blocks = []
  let bullets = []
  let ordered = []
  let quote = []
  let key = 0

  const flushBullets = () => {
    if (bullets.length) {
      const items = bullets
      blocks.push(
        <ul key={`ul-${key++}`}>
          {items.map((item, i) => (
            <li key={`uli-${key}-${i}`}>{renderInline(item, `uli-${key}-${i}`)}</li>
          ))}
        </ul>
      )
      bullets = []
    }
  }
  const flushOrdered = () => {
    if (ordered.length) {
      const items = ordered
      blocks.push(
        <ol key={`ol-${key++}`}>
          {items.map((item, i) => (
            <li key={`oli-${key}-${i}`}>{renderInline(item, `oli-${key}-${i}`)}</li>
          ))}
        </ol>
      )
      ordered = []
    }
  }
  const flushQuote = () => {
    if (quote.length) {
      const items = quote
      blocks.push(
        <blockquote key={`bq-${key++}`}>
          {items.map((q, i) => (
            <p key={`bqp-${key}-${i}`}>{renderInline(q, `bqp-${key}-${i}`)}</p>
          ))}
        </blockquote>
      )
      quote = []
    }
  }
  const flushAll = () => {
    flushBullets()
    flushOrdered()
    flushQuote()
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    const bulletMatch = line.match(/^\s*[-*•]\s+(.*)$/)
    const numberedMatch = line.match(/^\s*\d+\.\s+(.*)$/)
    const quoteMatch = line.match(/^\s*>\s?(.*)$/)

    if (bulletMatch) {
      flushOrdered()
      flushQuote()
      bullets.push(bulletMatch[1])
      continue
    }
    if (numberedMatch) {
      flushBullets()
      flushQuote()
      ordered.push(numberedMatch[1])
      continue
    }
    if (quoteMatch) {
      flushBullets()
      flushOrdered()
      quote.push(quoteMatch[1])
      continue
    }

    // Non-list/quote line — flush any open block first.
    flushAll()

    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      blocks.push(<hr key={`hr-${key++}`} className="my-4 border-white/10" />)
    } else if (/^####\s+/.test(line)) {
      blocks.push(<h4 key={`h4-${key++}`}>{renderInline(line.replace(/^####\s+/, ''), `h4-${key}`)}</h4>)
    } else if (/^###\s+/.test(line)) {
      blocks.push(<h3 key={`h3-${key++}`}>{renderInline(line.replace(/^###\s+/, ''), `h3-${key}`)}</h3>)
    } else if (/^##\s+/.test(line)) {
      blocks.push(<h2 key={`h2-${key++}`}>{renderInline(line.replace(/^##\s+/, ''), `h2-${key}`)}</h2>)
    } else if (/^#\s+/.test(line)) {
      blocks.push(<h2 key={`h1-${key++}`}>{renderInline(line.replace(/^#\s+/, ''), `h1-${key}`)}</h2>)
    } else if (line.trim() === '') {
      // Blank line — paragraph separator.
    } else {
      blocks.push(<p key={`p-${key++}`}>{renderInline(line, `p-${key}`)}</p>)
    }
  }

  flushAll()
  return blocks
}

/**
 * @param {object} props
 * @param {string} props.text          The (possibly partial) markdown text.
 * @param {boolean} props.isStreaming  Whether to show the blinking cursor.
 */
export default function StreamingText({ text, isStreaming }) {
  return (
    <div className="markdown-body">
      {renderMarkdown(text)}
      {isStreaming && (
        <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-blink bg-accent align-middle" />
      )}
    </div>
  )
}
