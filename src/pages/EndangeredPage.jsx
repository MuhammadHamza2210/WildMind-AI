// pages/EndangeredPage.jsx
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TrendingDown, TrendingUp, Minus, MapPin, Skull } from 'lucide-react'
import ConservationBadge from '../components/ConservationBadge'

// Population estimates are approximate, drawn from IUCN / WWF figures.
// `percentRemaining` = current population as a rough % of historic baseline.
const SPECIES = [
  {
    name: 'Vaquita',
    population: '~10',
    trend: 'down',
    percentRemaining: 1,
    region: 'Gulf of California, Mexico',
    threat: 'Bycatch in illegal gillnets',
    status: 'Critically Endangered',
  },
  {
    name: 'Javan Rhino',
    population: '~76',
    trend: 'flat',
    percentRemaining: 3,
    region: 'Ujung Kulon, Indonesia',
    threat: 'Habitat loss & poaching',
    status: 'Critically Endangered',
  },
  {
    name: 'Amur Leopard',
    population: '~100',
    trend: 'up',
    percentRemaining: 5,
    region: 'Russian Far East & NE China',
    threat: 'Poaching & deforestation',
    status: 'Critically Endangered',
  },
  {
    name: 'Sumatran Orangutan',
    population: '~14,000',
    trend: 'down',
    percentRemaining: 8,
    region: 'Sumatra, Indonesia',
    threat: 'Palm-oil deforestation',
    status: 'Critically Endangered',
  },
  {
    name: 'Mountain Gorilla',
    population: '~1,063',
    trend: 'up',
    percentRemaining: 15,
    region: 'Virunga Mountains, Central Africa',
    threat: 'Habitat loss & disease',
    status: 'Endangered',
  },
  {
    name: 'Sumatran Tiger',
    population: '~400',
    trend: 'down',
    percentRemaining: 6,
    region: 'Sumatra, Indonesia',
    threat: 'Poaching & habitat fragmentation',
    status: 'Critically Endangered',
  },
  {
    name: 'African Forest Elephant',
    population: '~415,000',
    trend: 'down',
    percentRemaining: 10,
    region: 'Congo Basin, Central Africa',
    threat: 'Ivory poaching',
    status: 'Critically Endangered',
  },
  {
    name: 'Hawksbill Sea Turtle',
    population: '~8,000 nesting females',
    trend: 'down',
    percentRemaining: 12,
    region: 'Tropical oceans worldwide',
    threat: 'Tortoiseshell trade & bycatch',
    status: 'Critically Endangered',
  },
  {
    name: 'Giant Panda',
    population: '~1,864',
    trend: 'up',
    percentRemaining: 35,
    region: 'Sichuan, China',
    threat: 'Habitat fragmentation',
    status: 'Vulnerable',
  },
  {
    name: 'Snow Leopard',
    population: '~4,000–6,500',
    trend: 'down',
    percentRemaining: 22,
    region: 'High mountains of Central Asia',
    threat: 'Poaching & prey decline',
    status: 'Vulnerable',
  },
]

const TOP_STATS = [
  { value: '9,065', label: 'Critically Endangered', color: '#FF4444' },
  { value: '16,306', label: 'Endangered', color: '#FF8C00' },
  { value: '28%', label: 'of assessed species threatened', color: '#FFD700' },
]

// Color used for the population bar based on status severity.
const STATUS_BAR_COLOR = {
  'Critically Endangered': '#FF4444',
  Endangered: '#FF8C00',
  Vulnerable: '#FFD700',
}

const TREND_CONFIG = {
  down: { Icon: TrendingDown, color: '#FF4444', label: 'Declining' },
  up: { Icon: TrendingUp, color: '#39FF14', label: 'Recovering' },
  flat: { Icon: Minus, color: '#D4A843', label: 'Stable' },
}

function SpeciesCard({ species, index }) {
  const navigate = useNavigate()
  const trend = TREND_CONFIG[species.trend]
  const barColor = STATUS_BAR_COLOR[species.status] || '#FFD700'
  const TrendIcon = trend.Icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="glass glass-hover p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(`/animal/${encodeURIComponent(species.name)}`)}
              className="font-display text-2xl font-bold text-text-primary transition-colors hover:text-accent"
            >
              {species.name}
            </button>
            <ConservationBadge status={species.status} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2 text-text-muted">
              <Skull size={15} className="shrink-0 text-amber" />
              <span>
                Population: <span className="font-semibold text-text-primary">{species.population}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <TrendIcon size={15} className="shrink-0" style={{ color: trend.color }} />
              <span style={{ color: trend.color }} className="font-semibold">
                {trend.label}
              </span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <MapPin size={15} className="shrink-0 text-accent" />
              <span>{species.region}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <span className="shrink-0">⚠️</span>
              <span>{species.threat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Population bar */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs text-text-muted">
          <span>Estimated % of historic population remaining</span>
          <span className="font-semibold" style={{ color: barColor }}>
            {species.percentRemaining}%
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${species.percentRemaining}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: barColor, boxShadow: `0 0 12px ${barColor}66` }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function EndangeredPage() {
  return (
    <div>
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">
          Species Under Threat
        </h1>
        <p className="mt-3 max-w-2xl text-text-muted">
          A snapshot of the planet’s most imperilled animals — and the pressures pushing them toward
          the edge.
        </p>
      </header>

      {/* Top stats */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {TOP_STATS.map((stat) => (
          <div key={stat.label} className="glass glass-hover p-6 text-center">
            <div className="font-display text-4xl font-extrabold" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Species list */}
      <div className="space-y-5">
        {SPECIES.map((species, i) => (
          <SpeciesCard key={species.name} species={species} index={i} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-text-muted">
        Figures are approximate and drawn from IUCN Red List and WWF estimates. Conservation status
        reflects current assessments.
      </p>
    </div>
  )
}
