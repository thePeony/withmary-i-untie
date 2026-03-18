import { useStore } from '../../store.jsx'
import { mysteries } from '../../data/mysteries.js'

export default function ResumePrompt({ onResume, onRestart }) {
  const { state } = useStore()
  const { session } = state

  if (!session) return null

  const mysteryLabel = mysteries[session.mysteryKey]?.label ?? ''
  const dayLabel = `${session.novenaDay}일차`

  // Find the current step description
  const currentStep = session.flow?.[session.stepIndex]
  const stepDesc = currentStep?.section ?? ''

  return (
    <div className="resume-overlay">
      <div className="resume-box">
        <p className="resume-label">이전 기도를 이어서 바칠 수 있습니다</p>
        <div className="resume-info">
          <span className="resume-badge">{dayLabel}</span>
          <span className="resume-mystery">{mysteryLabel}</span>
        </div>
        {stepDesc && (
          <p className="resume-position">
            멈춘 곳: <strong>{stepDesc}</strong>
          </p>
        )}
        {session.intention && (
          <p className="resume-intention">지향: {session.intention}</p>
        )}
        <div className="resume-actions">
          <button className="btn-secondary" onClick={onRestart}>
            처음부터
          </button>
          <button className="btn-primary" onClick={onResume}>
            계속
          </button>
        </div>
      </div>
    </div>
  )
}
