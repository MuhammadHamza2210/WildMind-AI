// pages/ExplorePage.jsx
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimalCard from '../components/AnimalCard'
import { getAnimal, EXPLORE_ANIMALS, CATEGORIES } from '../data/animals'

// Display labels for filter chips (Marine stays singular).
const FILTER_LABELS = {
  All: 'All',
  Mammal: 'Mammals',
  Bird: 'Birds',
  Reptile: 'Reptiles',
  Marine: 'Marine',
  Insect: 'Insects',
  Amphibian: 'Amphibians',
}

// Build the explore grid from the curated dataset so classes & descriptions
// always match the rest of the app.
const ANIMALS = EXPLORE_ANIMALS.map((n) => {
  const a = getAnimal(n)
  return { name: a.name, className: a.class, description: a.description }
})

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') || 'All'

  const setFilter = (f) => {
    if (f === 'All') setSearchParams({})
    else setSearchParams({ filter: f })
  }

  const filtered = useMemo(() => {
    if (filter === 'All') return ANIMALS
    return ANIMALS.filter((a) => a.className === filter)
  }, [filter])

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">
          Explore the Animal Kingdom
        </h1>
        <p className="mt-3 max-w-2xl text-text-muted">
          Browse a curated cross-section of life on Earth. Pick a creature to generate a full
          AI-written profile backed by accurate reference data.
        </p>
      </header>

      {/* Filters */}
      <div className="mb-10 flex flex-wrap gap-2.5">
        {CATEGORIES.map((f) => {
          const active = filter === f
          const label = FILTER_LABELS[f] || f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-btn border px-4 py-1.5 text-sm font-medium transition-all ${
                active
                  ? 'border-accent bg-accent/15 text-accent shadow-glow'
                  : 'border-white/10 text-text-muted hover:border-white/25 hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <motion.div
        key={filter}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((animal) => (
          <motion.div key={animal.name} variants={item}>
            <AnimalCard {...animal} />
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-text-muted">
          No animals in this category yet — try another class.
        </p>
      )}
    </div>
  )
}
