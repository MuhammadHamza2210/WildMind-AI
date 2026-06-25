// services/pexels.js
// Fetches an animal image via the backend proxy (/api/pexels) so the Pexels
// API key stays server-side and is never exposed to the browser.

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

/**
 * Fetch a single large image URL for the given animal query.
 *
 * @param {string} query  Animal name.
 * @returns {Promise<string>}  Image URL (falls back to a placeholder).
 */
export async function fetchAnimalImage(query) {
  try {
    const res = await fetch(`/api/pexels?query=${encodeURIComponent(query)}`)
    if (!res.ok) return FALLBACK_IMAGE
    const data = await res.json()
    return data.url || FALLBACK_IMAGE
  } catch {
    return FALLBACK_IMAGE
  }
}
