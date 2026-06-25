// services/wikipedia.js
// Fetches base animal metadata from the Wikipedia REST summary endpoint.
// No API key required.

const REST_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

/**
 * Attempt to extract a binomial scientific name (e.g. "Panthera leo") from
 * a block of summary text. Wikipedia summaries usually italicise the binomial
 * which we can't see in plain text, so we fall back to a capitalised-genus +
 * lowercase-species heuristic.
 *
 * @param {string} text
 * @returns {string|null}
 */
function parseScientificName(text) {
  if (!text) return null
  // Genus (Capitalised) + species (lowercase), optionally a subspecies word.
  const match = text.match(/\b([A-Z][a-z]+)\s([a-z]{3,})(?:\s([a-z]{3,}))?\b/)
  if (!match) return null
  return [match[1], match[2], match[3]].filter(Boolean).join(' ')
}

/**
 * Fetch a Wikipedia summary for the given title.
 *
 * @param {string} name  Animal name / article title.
 * @returns {Promise<{extract: string, thumbnail: string|null, scientificName: string|null, title: string|null}>}
 */
export async function fetchAnimalSummary(name) {
  // Wikipedia titles use underscores for spaces.
  const title = encodeURIComponent(name.trim().replace(/\s+/g, '_'))
  const res = await fetch(`${REST_SUMMARY}${title}`, {
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`Wikipedia lookup failed for "${name}" (${res.status}).`)
  }

  const data = await res.json()
  const extract = data.extract || ''

  return {
    extract,
    title: data.title || name,
    thumbnail: data.thumbnail?.source || null,
    scientificName: parseScientificName(extract),
  }
}
