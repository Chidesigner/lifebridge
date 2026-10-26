// Decorative illustration: three hospitals joined by an arch (the "bridge").
// Pure SVG with two small CSS animations (travelling dashes, pulsing nodes).
function Node({ x, y, label, big = false }) {
  const r = big ? 11 : 8
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r + 6}
        fill="none"
        stroke="#8fe3cf"
        strokeOpacity="0.5"
        style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'ring-pulse 3.2s ease-out infinite' }}
      />
      <circle cx={x} cy={y} r={r} fill="#061c22" stroke="#8fe3cf" strokeWidth="2" />
      <circle cx={x} cy={y} r={big ? 4 : 3} fill={big ? '#c9a96e' : '#8fe3cf'} />
      <text x={x} y={y + r + 24} textAnchor="middle" fontSize="13" fontWeight="600" fill="rgba(255,255,255,.7)">
        {label}
      </text>
    </g>
  )
}

function BridgeArc({ className = '' }) {
  return (
    <svg viewBox="0 0 600 300" className={className} role="img" aria-label="Hospitals connected through LifeBridge">
      <defs>
        <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8fe3cf" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#8fe3cf" />
          <stop offset="1" stopColor="#c9a96e" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <line x1="60" y1="215" x2="540" y2="215" stroke="rgba(255,255,255,.14)" strokeWidth="1.5" strokeDasharray="2 8" strokeLinecap="round" />
      <path d="M60 215 Q300 -35 540 215" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="1.5" />
      <path
        d="M60 215 Q300 -35 540 215"
        fill="none"
        stroke="url(#arc-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="8 12"
        style={{ animation: 'arc-dash 14s linear infinite' }}
      />
      <Node x={60} y={215} label="Hospital" />
      <Node x={540} y={215} label="Hospital" />
      <Node x={300} y={90} label="LifeBridge" big />
    </svg>
  )
}

export default BridgeArc
