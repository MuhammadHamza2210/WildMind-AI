// pages/AnimalProfile.jsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  RefreshCw,
  FlaskConical,
  BookOpen,
  Utensils,
  Mountain,
  Clock,
  Ruler,
  Globe,
  Sparkles,
} from 'lucide-react'
import { useAnimalData } from '../hooks/useAnimalData'
import { useOllamaStream } from '../hooks/useOllamaStream'
import { streamAnimalProfile, AI_PROVIDER, FALLBACK_ENABLED } from '../services/ai'
import StreamingText from '../components/StreamingText'
import AnimalCard from '../components/AnimalCard'
import ConservationBadge, { parseConservationStatus } from '../components/ConservationBadge'
import { getAnimal, classifyAnimal, getRelated } from '../data/animals'

function FactRow({ Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 border-b border-white/5 py-2.5 last:border-0">
      <Icon size={16} className="mt-0.5 shrink-0 text-accent" />
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          {label}
        </div>
        <div className="text-sm text-text-primary">{value}</div>
      </div>
    </div>
  )
}

export default function AnimalProfile() {
  const { name } = useParams()
  const navigate = useNavigate()
  const animalName = decodeURIComponent(name || '')

  // Curated dataset = instant, accurate facts (no network wait).
  const data = useMemo(() => getAnimal(animalName), [animalName])

  const { image, summary, isLoading } = useAnimalData(animalName)
  const { text, isStreaming, error: streamError, startStream } = useOllamaStream()
  const [usedFallback, setUsedFallback] = useState(false)

  const runStream = useCallback(() => {
    setUsedFallback(false)
    startStream((onChunk, onDone) =>
      streamAnimalProfile(
        data?.name || animalName,
        onChunk,
        onDone,
        () => setUsedFallback(true) // Gemini failed → fell back to Ollama
      )
    )
  }, [animalName, data, startStream])

  // Kick off the AI stream as soon as the animal changes.
  useEffect(() => {
    if (!animalName) return
    runStream()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalName])

  // Prefer accurate dataset values; fall back to Wikipedia/inference.
  const displayName = data?.name || animalName
  const inferredClass = data?.class || classifyAnimal(animalName)
  const scientificName = data?.scientificName || summary?.scientificName || null
  const conservationStatus =
    data?.status || parseConservationStatus(summary?.extract || '')

  // Image priority: Pexels result → dataset/Wikipedia thumbnail.
  const displayImage = image || summary?.thumbnail || null

  const related = useMemo(() => getRelated(animalName, 4), [animalName])

  const retry = runStream

  return (
    <div>
      {/* Title */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm font-medium text-text-muted transition-colors hover:text-accent"
        >
          ← Back
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl font-bold capitalize text-text-primary sm:text-5xl">
            {displayName}
          </h1>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            {inferredClass}
          </span>
        </div>
        {scientificName && (
          <p className="mt-2 font-display text-lg italic text-amber">{scientificName}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[40%_60%]">
        {/* Left column: image + instant facts + badge */}
        <div className="space-y-6">
          <div className="glass glass-hover overflow-hidden">
            {displayImage ? (
              <img src={displayImage} alt={displayName} className="h-72 w-full object-cover" />
            ) : (
              <div className="shimmer h-72 w-full" />
            )}
          </div>

          <div className="glass p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-text-primary">
                <BookOpen size={18} className="text-accent" /> Quick Facts
              </h2>
              <ConservationBadge status={conservationStatus} />
            </div>

            {data ? (
              <div className="-my-1">
                <FactRow Icon={Utensils} label="Diet" value={data.diet} />
                <FactRow Icon={Mountain} label="Habitat" value={data.habitat} />
                <FactRow Icon={Globe} label="Region" value={data.region} />
                <FactRow Icon={Clock} label="Lifespan" value={data.lifespan} />
                <FactRow Icon={Ruler} label="Size" value={data.size} />
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                No curated dataset entry for this search — facts below are generated by the AI.
              </p>
            )}

            {data?.fact && (
              <div className="mt-4 flex items-start gap-2 rounded-btn border border-accent/20 bg-accent/5 p-3">
                <Sparkles size={15} className="mt-0.5 shrink-0 text-accent" />
                <p className="text-sm text-text-primary">{data.fact}</p>
              </div>
            )}

            {(data?.description || summary?.extract) && (
              <p className="mt-4 border-t border-white/5 pt-4 text-sm leading-relaxed text-text-muted">
                {data?.description || summary?.extract}
              </p>
            )}
          </div>
        </div>

        {/* Right column: streaming AI content */}
        <div className="glass min-h-[240px] p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-text-primary">
              <FlaskConical size={18} className="text-accent" /> AI Summary
            </h2>
            {!isStreaming && text && (
              <button
                onClick={retry}
                className="flex items-center gap-1.5 rounded-btn border border-white/10 px-3 py-1 text-xs font-medium text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                <RefreshCw size={13} /> Regenerate
              </button>
            )}
          </div>

          {streamError ? (
            <div className="flex flex-col items-start gap-3 rounded-card border border-status-critical/30 bg-status-critical/5 p-5">
              <div className="flex items-center gap-2 text-status-critical">
                <AlertTriangle size={18} />
                <span className="font-semibold">Couldn’t reach the AI model</span>
              </div>
              <p className="text-sm text-text-muted">{streamError}</p>
              {FALLBACK_ENABLED ? (
                <p className="text-sm text-text-muted">
                  Gemini is unavailable (often a rate limit) and the local Ollama fallback isn’t
                  reachable. Start Ollama to keep things working:
                  <code className="ml-1 rounded bg-white/5 px-1.5 py-0.5 text-accent">
                    ollama run llama3.2:1b
                  </code>
                </p>
              ) : AI_PROVIDER === 'ollama' ? (
                <p className="text-sm text-text-muted">
                  Make sure Ollama is running and the model is pulled:
                  <code className="ml-1 rounded bg-white/5 px-1.5 py-0.5 text-accent">
                    ollama run llama3.2:1b
                  </code>
                </p>
              ) : (
                <p className="text-sm text-text-muted">
                  Check that{' '}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-accent">
                    VITE_GEMINI_API_KEY
                  </code>{' '}
                  is set correctly in your <code>.env</code> file.
                </p>
              )}
              <button
                onClick={retry}
                className="mt-1 flex items-center gap-1.5 rounded-btn bg-accent/90 px-3 py-1.5 text-sm font-semibold text-background hover:bg-accent"
              >
                <RefreshCw size={14} /> Try again
              </button>
            </div>
          ) : text ? (
            <>
              {usedFallback && (
                <div className="mb-3 flex items-center gap-2 rounded-btn border border-amber/30 bg-amber/10 px-3 py-2 text-xs text-amber">
                  <RefreshCw size={13} /> Gemini was busy (rate limit) — answered with the local
                  model.
                </div>
              )}
              <StreamingText text={text} isStreaming={isStreaming} />
            </>
          ) : (
            <div className="flex items-center gap-3 py-8 text-text-muted">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
              Consulting the AI biologist…
            </div>
          )}
        </div>
      </div>

      {!isLoading && !image && !summary && (
        <p className="mt-6 text-sm text-text-muted">
          Reference imagery couldn’t be loaded — showing curated data and AI content only.
        </p>
      )}

      {/* Related animals */}
      <section className="mt-16">
        <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">Related Animals</h2>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {related.map((n) => (
            <motion.div
              key={n}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <AnimalCard name={n} className={classifyAnimal(n)} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
