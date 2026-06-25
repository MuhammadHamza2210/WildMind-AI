// components/AnimalCard.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { fetchAnimalImage } from '../services/pexels'

/**
 * A glassmorphism card for an animal. Lazily fetches its Pexels image unless
 * an `image` prop is supplied. Navigates to the animal profile on click.
 *
 * @param {object} props
 * @param {string} props.name
 * @param {string} [props.className]  e.g. "Mammal"
 * @param {string} [props.description]
 * @param {string} [props.image]      Pre-fetched image URL (skips fetching).
 * @param {object} [props.motionProps] Extra framer-motion props (e.g. variants).
 */
export default function AnimalCard({
  name,
  className: animalClass,
  description,
  image: imageProp,
  motionProps = {},
}) {
  const navigate = useNavigate()
  const [image, setImage] = useState(imageProp || null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (imageProp) {
      setImage(imageProp)
      return
    }
    let cancelled = false
    fetchAnimalImage(name).then((url) => {
      if (!cancelled) setImage(url)
    })
    return () => {
      cancelled = true
    }
  }, [name, imageProp])

  return (
    <motion.button
      type="button"
      onClick={() => navigate(`/animal/${encodeURIComponent(name)}`)}
      whileHover={{ y: -6 }}
      className="glass glass-hover group relative flex h-72 w-full flex-col justify-end overflow-hidden text-left"
      {...motionProps}
    >
      {/* Image */}
      <div className="absolute inset-0">
        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        {!loaded && <div className="shimmer h-full w-full" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-5">
        {animalClass && (
          <span className="mb-2 inline-block rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
            {animalClass}
          </span>
        )}
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold text-text-primary">{name}</h3>
          <ArrowUpRight
            size={22}
            className="text-text-muted transition-colors group-hover:text-accent"
          />
        </div>
        {description && (
          <p className="mt-1 max-h-0 overflow-hidden text-sm text-text-muted opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100">
            {description}
          </p>
        )}
      </div>
    </motion.button>
  )
}
