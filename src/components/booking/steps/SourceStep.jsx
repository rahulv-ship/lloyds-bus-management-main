import { MapPin } from 'lucide-react'
import './SourceStep.css'

export default function SourceStep({ sources, value, onChange }) {
  return (
    <div className="stack">
      <h3>Where do you travel from?</h3>
      <div className="source-grid">
        {sources.map((source) => (
          <button
            type="button"
            key={source.key}
            className={`source-option ${value === source.key ? 'is-selected' : ''}`}
            onClick={() => onChange(source.key)}
          >
            <MapPin size={18} aria-hidden="true" />
            {source.label}
          </button>
        ))}
      </div>
    </div>
  )
}
