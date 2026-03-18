export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-icon">
          <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Cross */}
            <rect x="27" y="0" width="6" height="30" rx="3" fill="currentColor" opacity="0.7"/>
            <rect x="16" y="8" width="28" height="6" rx="3" fill="currentColor" opacity="0.7"/>
            {/* Beads chain */}
            <line x1="30" y1="30" x2="30" y2="42" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
            {/* Center bead */}
            <circle cx="30" cy="46" r="4" fill="currentColor" opacity="0.8"/>
            {/* Loop beads */}
            <circle cx="30" cy="56" r="3" fill="currentColor" opacity="0.6"/>
            <circle cx="22" cy="62" r="3" fill="currentColor" opacity="0.5"/>
            <circle cx="16" cy="70" r="3" fill="currentColor" opacity="0.4"/>
            <circle cx="38" cy="62" r="3" fill="currentColor" opacity="0.5"/>
            <circle cx="44" cy="70" r="3" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
        <p className="loading-app-name">With Mary, I Untie</p>
        <p className="loading-caption">성모님 앞에, 당신의 매듭을 올려놓으세요.</p>
      </div>
    </div>
  )
}
