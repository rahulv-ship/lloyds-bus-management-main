import BusCard from '../BusCard'
import { SkeletonCard } from '../../common/Skeleton'
import './BusStep.css'

export default function BusStep({ buses, selectedBusId, onSelect, loading, ready }) {
  if (!ready) {
    return <p>Select source, boarding point, shift and dates to see available buses.</p>
  }

  if (loading) {
    return (
      <div className="bus-step__grid">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} lines={4} />
        ))}
      </div>
    )
  }

  if (!buses.length) {
    return <p>No buses are available for the selected boarding point, shift and dates.</p>
  }

  return (
    <div className="stack">
      <h3>Choose your bus</h3>
      <div className="bus-step__grid">
        {buses.map((bus) => (
          <BusCard
            key={`${bus.bus_id}-${bus.bus_route_id}`}
            bus={bus}
            selected={String(selectedBusId) === String(bus.bus_id)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
