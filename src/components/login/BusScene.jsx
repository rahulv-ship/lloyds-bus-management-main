// Geometric, restrained transit illustration — no cartoonish faces or
// bright consumer-app colors, deliberately close to the token palette
// so the scene feels like part of the product rather than a splash video.
export default function BusScene() {
  return (
    <svg
      className="ls-scene-svg"
      viewBox="0 0 1000 420"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ls-sky-top)" />
          <stop offset="100%" stopColor="var(--ls-sky-bottom)" />
        </linearGradient>
        <linearGradient id="ls-bus-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ls-bus-top)" />
          <stop offset="100%" stopColor="var(--ls-bus-bottom)" />
        </linearGradient>
      </defs>

      <rect width="1000" height="420" fill="url(#ls-sky)" />

      {/* ground + road */}
      <rect x="0" y="330" width="1000" height="90" fill="var(--ls-ground)" />
      <rect x="0" y="330" width="1000" height="4" fill="var(--ls-road-edge)" />
      <g className="ls-road-dashes">
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={i * 76 - 40} y="374" width="34" height="5" rx="2" fill="var(--ls-road-dash)" />
        ))}
      </g>

      {/* bus stop shelter */}
      <g className="ls-shelter">
        <rect x="118" y="230" width="6" height="100" fill="var(--ls-shelter-frame)" />
        <rect x="270" y="230" width="6" height="100" fill="var(--ls-shelter-frame)" />
        <rect x="112" y="222" width="170" height="10" rx="2" fill="var(--ls-shelter-frame)" />
        <rect x="118" y="236" width="158" height="64" rx="2" fill="var(--ls-shelter-glass)" opacity="0.55" />
        <rect x="150" y="200" width="96" height="26" rx="5" fill="var(--color-brand-primary)" />
        <text x="198" y="217" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ef4444;" fontFamily="var(--font-display)">
          BUS STOP
        </text>
      </g>

      {/* waiting figures — simple, professional silhouettes */}
      <g className="ls-figure" data-figure="1" transform="translate(150,330)">
        <circle cx="0" cy="-56" r="11" fill="var(--ls-figure)" />
        <rect x="-9" y="-46" width="18" height="34" rx="7" fill="var(--ls-figure)" />
        <rect x="-8" y="-10" width="7" height="22" rx="3" fill="var(--ls-figure)" />
        <rect x="1" y="-10" width="7" height="22" rx="3" fill="var(--ls-figure)" />
      </g>
      <g className="ls-figure" data-figure="2" transform="translate(190,330)">
        <circle cx="0" cy="-60" r="11" fill="var(--ls-figure-alt)" />
        <rect x="-9" y="-50" width="18" height="36" rx="7" fill="var(--ls-figure-alt)" />
        <rect x="-8" y="-12" width="7" height="24" rx="3" fill="var(--ls-figure-alt)" />
        <rect x="1" y="-12" width="7" height="24" rx="3" fill="var(--ls-figure-alt)" />
      </g>
      <g className="ls-figure" data-figure="3" transform="translate(228,330)">
        <circle cx="0" cy="-54" r="10" fill="var(--ls-figure)" />
        <rect x="-8" y="-45" width="16" height="32" rx="6" fill="var(--ls-figure)" />
        <rect x="-7" y="-11" width="6" height="21" rx="3" fill="var(--ls-figure)" />
        <rect x="1" y="-11" width="6" height="21" rx="3" fill="var(--ls-figure)" />
      </g>

      {/* bus */}
      <g className="ls-bus" transform="translate(1050,196)">
        <rect x="0" y="40" width="300" height="110" rx="18" fill="url(#ls-bus-body)" />
        <rect x="0" y="40" width="300" height="14" rx="7" fill="var(--color-brand-accent)" />
        <rect x="14" y="66" width="52" height="40" rx="6" fill="var(--ls-bus-window)" />
        <rect x="76" y="66" width="52" height="40" rx="6" fill="var(--ls-bus-window)" />
        <rect x="138" y="66" width="52" height="40" rx="6" fill="var(--ls-bus-window)" />
        <rect x="200" y="66" width="40" height="40" rx="6" fill="var(--ls-bus-window)" />

        {/* doors — two panels that slide together to close */}
        <g className="ls-door-left">
          <rect x="248" y="66" width="17" height="76" rx="3" fill="var(--ls-bus-door)" />
        </g>
        <g className="ls-door-right">
          <rect x="266" y="66" width="17" height="76" rx="3" fill="var(--ls-bus-door)" />
        </g>

        <text x="130" y="94" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--ls-bus-window)" fontFamily="var(--font-display)" opacity="0.9">
          LLOYDS
        </text>

        <circle cx="60" cy="152" r="22" fill="var(--ls-wheel)" />
        <circle cx="60" cy="152" r="8" fill="var(--ls-wheel-hub)" />
        <circle cx="230" cy="152" r="22" fill="var(--ls-wheel)" />
        <circle cx="230" cy="152" r="8" fill="var(--ls-wheel-hub)" />

        <rect x="-6" y="70" width="8" height="30" rx="3" fill="var(--ls-headlight)" />
      </g>
    </svg>
  )
}
