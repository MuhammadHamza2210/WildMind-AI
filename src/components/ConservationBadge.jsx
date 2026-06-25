// components/ConservationBadge.jsx
import { ShieldAlert, ShieldCheck, ShieldX, Shield, ShieldQuestion } from 'lucide-react'

// Status -> color + icon mapping per the design system.
const STATUS_CONFIG = {
  Extinct: { color: '#6B7280', Icon: ShieldX },
  'Critically Endangered': { color: '#FF4444', Icon: ShieldAlert },
  Endangered: { color: '#FF8C00', Icon: ShieldAlert },
  Vulnerable: { color: '#FFD700', Icon: Shield },
  'Near Threatened': { color: '#90EE90', Icon: Shield },
  'Least Concern': { color: '#39FF14', Icon: ShieldCheck },
  'Data Deficient': { color: '#9CA3AF', Icon: ShieldQuestion },
}

/**
 * Parse a conservation status out of free Wikipedia extract text.
 * Order matters — check the most specific phrases first.
 *
 * @param {string} text
 * @returns {string}  A canonical status label.
 */
export function parseConservationStatus(text = '') {
  const t = text.toLowerCase()
  if (t.includes('critically endangered')) return 'Critically Endangered'
  if (t.includes('near threatened')) return 'Near Threatened'
  if (t.includes('endangered')) return 'Endangered'
  if (t.includes('vulnerable')) return 'Vulnerable'
  if (t.includes('extinct')) return 'Extinct'
  if (t.includes('least concern')) return 'Least Concern'
  return 'Least Concern'
}

export default function ConservationBadge({ status = 'Least Concern', className = '' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Least Concern']
  const { color, Icon } = config

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${className}`}
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}1a`,
      }}
    >
      <Icon size={14} strokeWidth={2.5} />
      {status}
    </span>
  )
}
