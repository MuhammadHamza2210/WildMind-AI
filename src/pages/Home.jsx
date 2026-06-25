// pages/Home.jsx
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Globe2,
  ShieldAlert,
  Sparkles,
  MessageSquare,
  ArrowRight,
  PawPrint,
  Bird,
  Turtle,
  Fish,
  Bug,
  Droplets,
  Cpu,
  Database,
  Zap,
} from 'lucide-react'
import SearchBar from '../components/SearchBar'
import AnimalCard from '../components/AnimalCard'
import { getAnimal } from '../data/animals'
import { AI_PROVIDER } from '../services/ai'

const USING_GEMINI = AI_PROVIDER === 'gemini'
const AI_LABEL = USING_GEMINI ? 'Google Gemini' : 'local Llama 3.2'
const AI_TAGLINE = USING_GEMINI
  ? 'Powered by Google Gemini — fast, accurate answers streamed in seconds.'
  : 'Powered by local Llama 3.2 via Ollama — your curiosity stays on your machine.'

const FEATURED = ['Lion', 'Blue Whale', 'Monarch Butterfly'].map((n) => {
  const a = getAnimal(n)
  return { name: a.name, className: a.class, description: a.description }
})

const CATEGORY_TILES = [
  { label: 'Mammals', filter: 'Mammal', Icon: PawPrint },
  { label: 'Birds', filter: 'Bird', Icon: Bird },
  { label: 'Reptiles', filter: 'Reptile', Icon: Turtle },
  { label: 'Marine', filter: 'Marine', Icon: Fish },
  { label: 'Insects', filter: 'Insect', Icon: Bug },
  { label: 'Amphibians', filter: 'Amphibian', Icon: Droplets },
]

const STATS = [
  { icon: Globe2, value: '1M+', label: 'Species Documented' },
  { icon: ShieldAlert, value: '41,000', label: 'Threatened Species' },
  { icon: Sparkles, value: 'AI-Powered', label: 'Insights & Profiles' },
]

const FEATURES = [
  USING_GEMINI
    ? {
        Icon: Cpu,
        title: 'Cloud AI, Blazing Fast',
        body: 'Profiles and chat run on Google Gemini Flash — fast, high-quality responses with a generous free tier.',
      }
    : {
        Icon: Cpu,
        title: '100% Local AI',
        body: 'Profiles and chat run on Llama 3.2 via Ollama on your own machine — nothing leaves your device.',
      },
  {
    Icon: Database,
    title: 'Accurate by Design',
    body: 'Taxonomy, diet, habitat and IUCN status come from a curated dataset, so facts are never hallucinated.',
  },
  {
    Icon: Zap,
    title: 'Instant + Streaming',
    body: 'Key facts appear immediately while a rich, expert field guide streams in token by token.',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// Decorative, slowly drifting bioluminescent orbs behind the hero.
function AuroraBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -left-32 -top-24 h-[34rem] w-[34rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.16), transparent 70%)' }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-24 top-20 h-[28rem] w-[28rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.14), transparent 70%)' }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.10), transparent 70%)' }}
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* faint grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 75%)',
        }}
      />
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const handleSearch = (query) => navigate(`/animal/${encodeURIComponent(query)}`)

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative flex min-h-[86vh] flex-col items-center justify-center text-center">
        <AuroraBackdrop />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-3xl"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            The AI Wildlife Encyclopedia
          </motion.span>

          <h1 className="font-display text-5xl font-extrabold leading-[1.04] text-white sm:text-6xl md:text-7xl">
            Every species has a{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(120deg, #39FF14, #D4A843)' }}
            >
              story.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-accent/80 sm:text-xl">
            Ask WildMind anything about the animal kingdom — get an expert, AI-written field guide
            in seconds.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <SearchBar onSubmit={handleSearch} autoFocus />
          </div>

          {/* Quick category chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-text-muted">Popular:</span>
            {['Snow Leopard', 'Orca', 'King Cobra', 'Axolotl'].map((n) => (
              <button
                key={n}
                onClick={() => handleSearch(n)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-text-muted transition-all hover:border-accent/40 hover:text-accent"
              >
                {n}
              </button>
            ))}
          </div>

          <p className="mt-8 text-sm text-text-muted">{AI_TAGLINE}</p>
        </motion.div>
      </section>

      {/* ── Featured Today ─────────────────────────────────── */}
      <section className="mt-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-text-primary">Featured Today</h2>
            <p className="mt-1 text-text-muted">Three icons of the wild, hand-picked.</p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="group flex items-center gap-1.5 text-sm font-medium text-accent"
          >
            Explore all
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURED.map((animal) => (
            <motion.div key={animal.name} variants={item}>
              <AnimalCard {...animal} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Browse by category ─────────────────────────────── */}
      <section className="mt-20">
        <h2 className="mb-8 font-display text-3xl font-bold text-text-primary">Browse by Class</h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {CATEGORY_TILES.map(({ label, filter, Icon }) => (
            <motion.button
              key={filter}
              variants={item}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/explore?filter=${filter}`)}
              className="glass glass-hover flex flex-col items-center gap-3 px-4 py-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/25">
                <Icon size={22} className="text-accent" />
              </span>
              <span className="text-sm font-semibold text-text-primary">{label}</span>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* ── Stats band ─────────────────────────────────────── */}
      <section className="mt-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="glass glass-hover flex items-center gap-4 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-btn bg-accent/10 ring-1 ring-accent/25">
                <Icon size={24} className="text-accent" />
              </span>
              <div>
                <div className="font-display text-2xl font-bold text-text-primary">{value}</div>
                <div className="text-sm text-text-muted">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why WildMind ───────────────────────────────────── */}
      <section className="mt-20">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary">Why WildMind</h2>
          <p className="mx-auto mt-2 max-w-xl text-text-muted">
            A premium encyclopedia experience that’s private, accurate, and fast.
          </p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {FEATURES.map(({ Icon, title, body }) => (
            <motion.div key={title} variants={item} className="glass glass-hover p-7">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-btn bg-accent/10 ring-1 ring-accent/25">
                <Icon size={22} className="text-accent" />
              </span>
              <h3 className="font-display text-xl font-bold text-text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="mt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass relative overflow-hidden p-10 text-center sm:p-14"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(57,255,20,0.12), transparent 70%)',
            }}
          />
          <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
            Curious about the natural world?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-text-muted">
            Chat with WildMind, your personal AI naturalist, about any animal, ecosystem, or
            conservation question.
          </p>
          <button
            onClick={() => navigate('/chat')}
            className="mx-auto mt-7 flex items-center gap-2 rounded-btn bg-accent px-6 py-3 text-sm font-semibold text-background transition-all hover:shadow-glow-strong"
          >
            <MessageSquare size={18} /> Start chatting
          </button>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="mt-20 border-t border-white/5 pt-8 text-center text-sm text-text-muted">
        <p>
          WildMind AI · Built with React, Vite & {AI_LABEL} · Data from a curated dataset,
          Wikipedia & Pexels.
        </p>
      </footer>
    </div>
  )
}
