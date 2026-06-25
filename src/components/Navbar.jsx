// components/Navbar.jsx
import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Menu, X } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/explore', label: 'Explore' },
  { to: '/chat', label: 'Chat' },
  { to: '/endangered', label: 'Endangered' },
]

function NavItem({ to, label, end, onClick }) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className="group relative px-1 py-1">
      {({ isActive }) => (
        <>
          <span
            className={`text-sm font-medium transition-colors ${
              isActive ? 'text-accent' : 'text-text-primary/80 hover:text-text-primary'
            }`}
          >
            {label}
          </span>
          {isActive && (
            <motion.span
              layoutId="nav-underline"
              className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-accent"
              style={{ boxShadow: '0 0 8px rgba(57,255,20,0.7)' }}
            />
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className="border-b border-white/5"
        style={{
          background: 'rgba(8,12,18,0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-btn bg-accent/10 ring-1 ring-accent/30">
              <Leaf size={20} className="text-accent" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-text-primary">
              Wild<span className="text-accent">Mind</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <NavItem key={l.to} {...l} />
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="rounded-btn p-2 text-text-primary md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-3">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-btn px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-primary/80 hover:bg-white/5'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}
