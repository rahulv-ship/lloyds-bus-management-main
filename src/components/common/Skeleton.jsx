import './Skeleton.css'

export default function Skeleton({ width = '100%', height = '16px', radius = 'var(--radius-sm)', style }) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card skeleton-card">
      <Skeleton width="40%" height="14px" />
      <div className="skeleton-card__lines">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} height="12px" width={i === lines - 1 ? '60%' : '100%'} />
        ))}
      </div>
    </div>
  )
}
