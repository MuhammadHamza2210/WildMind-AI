// components/SearchBar.jsx
import { useState } from 'react'
import { Search, X } from 'lucide-react'

/**
 * Controlled search input with a focus glow, submit-on-enter and a clear button.
 *
 * @param {object} props
 * @param {(value: string) => void} props.onSubmit  Called with the trimmed query.
 * @param {string} [props.placeholder]
 * @param {string} [props.initialValue]
 * @param {boolean} [props.autoFocus]
 */
export default function SearchBar({
  onSubmit,
  placeholder = "Try 'Snow Leopard' or 'Blue Whale'...",
  initialValue = '',
  autoFocus = false,
}) {
  const [value, setValue] = useState(initialValue)
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`glass flex w-full items-center gap-3 px-4 py-3 transition-all duration-300 ${
        focused ? 'shadow-glow-strong' : ''
      }`}
      style={{
        borderColor: focused ? 'rgba(57,255,20,0.6)' : 'rgba(255,255,255,0.08)',
      }}
    >
      <Search size={20} className="shrink-0 text-accent" />
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        aria-label="Search for an animal"
        className="w-full bg-transparent text-base text-text-primary placeholder:text-text-muted focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="Clear search"
          className="shrink-0 rounded-full p-1 text-text-muted transition-colors hover:text-text-primary"
        >
          <X size={18} />
        </button>
      )}
      <button
        type="submit"
        aria-label="Search"
        className="shrink-0 rounded-btn bg-accent/90 px-3 py-1.5 text-sm font-semibold text-background transition-all hover:bg-accent"
      >
        Search
      </button>
    </form>
  )
}
