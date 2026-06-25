// hooks/useAnimalData.js
import { useEffect, useState } from 'react'
import { fetchAnimalImage } from '../services/pexels'
import { fetchAnimalSummary } from '../services/wikipedia'

/**
 * Fetches a Pexels image + Wikipedia summary for an animal in parallel.
 *
 * @param {string} animalName
 * @returns {{ image: string|null, summary: object|null, isLoading: boolean, error: string|null }}
 */
export function useAnimalData(animalName) {
  const [image, setImage] = useState(null)
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!animalName) return

    let cancelled = false
    setIsLoading(true)
    setError(null)
    setImage(null)
    setSummary(null)

    async function load() {
      try {
        // Wikipedia may legitimately 404 for some titles; don't let that block
        // the image. Use allSettled so one failure doesn't reject the other.
        const [imgResult, sumResult] = await Promise.allSettled([
          fetchAnimalImage(animalName),
          fetchAnimalSummary(animalName),
        ])

        if (cancelled) return

        if (imgResult.status === 'fulfilled') {
          setImage(imgResult.value)
        }

        if (sumResult.status === 'fulfilled') {
          setSummary(sumResult.value)
        } else {
          // No Wikipedia article — not fatal, AI content still renders.
          setSummary(null)
        }

        if (imgResult.status === 'rejected' && sumResult.status === 'rejected') {
          setError('Could not load any reference data for this animal.')
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load animal data.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [animalName])

  return { image, summary, isLoading, error }
}
