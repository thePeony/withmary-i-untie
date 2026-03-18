import { useStore } from '../../store.jsx'

export default function RosaryBeads({ step }) {
  const { state, dispatch } = useStore()
  const beadCount = state.session?.beadCount ?? 0

  const handleBead = (index) => {
    if (index !== beadCount) return // must tap in order
    dispatch({ type: 'TAP_BEAD' })
  }

  return (
    <div className="beads-screen">
      <div className="beads-header">
        <h2 className="beads-prayer-title">{step.prayerTitle}</h2>
        <p className="beads-count-label">{beadCount} / 10</p>
      </div>

      <div className="beads-prayer-text">
        {step.prayerBody.split('\n').map((line, i) => (
          <p key={i}>{line || '\u00A0'}</p>
        ))}
      </div>

      <div className="beads-row" role="group" aria-label="성모송 묵주알">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            className={`bead ${i < beadCount ? 'bead-done' : ''} ${i === beadCount ? 'bead-current' : ''}`}
            onClick={() => handleBead(i)}
            aria-label={`${i + 1}번째 성모송${i < beadCount ? ' (완료)' : ''}`}
            aria-pressed={i < beadCount}
          />
        ))}
      </div>

      <p className="beads-hint">
        {beadCount < 10 ? `${beadCount + 1}번째 성모송을 바칩니다` : '다음 단계로 넘어갑니다…'}
      </p>
    </div>
  )
}
