import { Bus, MapPin, Radio } from 'lucide-react'
import './LiveMapPreview.css'

// This is deliberately a visual route preview, not fabricated GPS data.
// It provides a reserved live-map surface that can be connected to the GPS
// provider later without changing the pass or booking APIs.
export default function LiveMapPreview({ app }) {
  const origin = app?.pickupStop?.stop_name || 'Boarding point'
  const destination = app?.dropStop?.stop_name || 'Plant'

  return <section className="live-map" aria-label="Live bus map preview">
    <div className="live-map__head">
      <div><span className="live-map__eyebrow"><Radio size={13} /> Live tracking</span><h2>Route map</h2></div>
      <span className="live-map__pending">GPS integration pending</span>
    </div>
    <div className="live-map__canvas" aria-hidden="true">
      <span className="live-map__road live-map__road--one" /><span className="live-map__road live-map__road--two" />
      <svg className="live-map__route" viewBox="0 0 420 230" preserveAspectRatio="none"><path d="M35 184 C 104 173, 125 76, 211 115 S 315 168, 387 49" /></svg>
      <span className="live-map__pin live-map__pin--start"><MapPin size={20} /></span>
      <span className="live-map__pin live-map__pin--end"><MapPin size={20} /></span>
      <span className="live-map__bus"><Bus size={18} /></span>
      <span className="live-map__label live-map__label--start">{origin}</span><span className="live-map__label live-map__label--end">{destination}</span>
    </div>
    <p>Bus location will appear here when the fleet GPS feed is connected. Your pass and journey details remain live.</p>
  </section>
}
