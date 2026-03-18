import { useState } from 'react'
import { useStore, getNextNovenaDay } from '../../store.jsx'
import { getAutoMysteryKey } from '../../data/content.js'
import ResumePrompt from './ResumePrompt.jsx'
import IntentionInput from './IntentionInput.jsx'
import MysterySelector from './MysterySelector.jsx'
import FlowScreen from './FlowScreen.jsx'

// Setup phases for new session
const SETUP_MYSTERY = 'mystery'
const SETUP_INTENTION = 'intention'
const SETUP_CONFIRM = 'confirm'

export default function PrayerTab() {
  const { state, dispatch } = useStore()
  const { session, records } = state

  const [showResume, setShowResume] = useState(!!session && !session.completed)
  const [setupPhase, setSetupPhase] = useState(null)  // null | 'mystery' | 'intention' | 'confirm'
  const [pendingMystery, setPendingMystery] = useState(getAutoMysteryKey())
  const [pendingDay] = useState(getNextNovenaDay(records))

  // Active session running
  if (session && !session.completed && !showResume) {
    return (
      <div className="prayer-tab">
        <SessionHeader />
        <FlowScreen />
        <IntentionFloatButton />
      </div>
    )
  }

  // Completed session
  if (session && session.completed) {
    return (
      <div className="prayer-tab prayer-tab--center">
        <CompletedBanner onNew={startNewSetup} />
      </div>
    )
  }

  // Resume prompt
  if (showResume && session) {
    return (
      <div className="prayer-tab">
        <ResumePrompt
          onResume={() => setShowResume(false)}
          onRestart={() => {
            dispatch({ type: 'DISCARD_SESSION' })
            setShowResume(false)
            setSetupPhase(SETUP_MYSTERY)
          }}
        />
      </div>
    )
  }

  // Setup flow
  if (setupPhase === SETUP_MYSTERY) {
    return (
      <div className="prayer-tab prayer-tab--setup">
        <h2 className="setup-heading">{pendingDay}일차 기도</h2>
        <MysterySelector
          selected={pendingMystery}
          onSelect={setPendingMystery}
        />
        <button
          className="btn-primary setup-next"
          onClick={() => setSetupPhase(SETUP_INTENTION)}
        >
          다음
        </button>
      </div>
    )
  }

  if (setupPhase === SETUP_INTENTION) {
    return (
      <div className="prayer-tab prayer-tab--setup">
        <IntentionSetup
          onDone={(intention) => {
            dispatch({
              type: 'START_SESSION',
              mysteryKey: pendingMystery,
              novenaDay: pendingDay,
              intention,
            })
            setSetupPhase(null)
          }}
          onSkip={() => {
            dispatch({
              type: 'START_SESSION',
              mysteryKey: pendingMystery,
              novenaDay: pendingDay,
              intention: '',
            })
            setSetupPhase(null)
          }}
        />
      </div>
    )
  }

  // Home / start screen
  return (
    <div className="prayer-tab prayer-tab--home">
      <HomeScreen onStart={startNewSetup} novenaDay={pendingDay} />
    </div>
  )

  function startNewSetup() {
    setSetupPhase(SETUP_MYSTERY)
  }
}

function SessionHeader() {
  const { state } = useStore()
  const { session } = state
  if (!session) return null

  const progress = session.flow ? Math.round((session.stepIndex / session.flow.length) * 100) : 0

  return (
    <header className="session-header">
      <div className="session-progress-bar">
        <div className="session-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="session-day-label">{session.novenaDay}일차 · {progress}%</p>
    </header>
  )
}

function IntentionFloatButton() {
  const { state } = useStore()
  const [open, setOpen] = useState(false)
  const session = state.session

  if (!session || session.completed) return null

  return (
    <>
      <button
        className="intention-float-btn"
        onClick={() => setOpen(true)}
        aria-label="지향 수정"
        title="지향 수정"
      >
        {session.intention ? '✦' : '+'}
      </button>
      {open && <IntentionInput onDone={() => setOpen(false)} />}
    </>
  )
}

function HomeScreen({ onStart, novenaDay }) {
  return (
    <div className="home-screen">
      <div className="home-content">
        <h1 className="home-app-title">With Mary,<br/>I Untie</h1>
        <p className="home-subtitle">매듭을 푸는 성모님 9일기도</p>
        <div className="home-day-badge">{novenaDay}일차</div>
        <button className="btn-start" onClick={onStart}>
          기도 시작
        </button>
        <p className="home-hint">
          성모님과 함께<br />
          오늘의 매듭을 풀어드립니다
        </p>
      </div>
    </div>
  )
}

function CompletedBanner({ onNew }) {
  return (
    <div className="completed-banner">
      <div className="completed-icon">✦</div>
      <h2>기도를 마쳤습니다</h2>
      <p>성모님의 전구로<br/>당신의 매듭이 풀리기를 기도합니다.</p>
      <button className="btn-primary" onClick={onNew}>
        새 기도 시작
      </button>
    </div>
  )
}

function IntentionSetup({ onDone, onSkip }) {
  const [text, setText] = useState('')

  return (
    <div className="intention-setup">
      <h2 className="setup-heading">기도 지향</h2>
      <p className="intention-hint">
        성모님께 드리고 싶은 매듭이나 지향을 적어두세요.
        <br />
        비워도 기도를 시작할 수 있습니다.
      </p>
      <textarea
        className="intention-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="예: 가족의 화해, 직장 문제, 건강…"
        rows={4}
        autoFocus
      />
      <div className="intention-setup-actions">
        <button className="btn-secondary" onClick={onSkip}>
          건너뛰기
        </button>
        <button className="btn-primary" onClick={() => onDone(text)}>
          기도 시작
        </button>
      </div>
    </div>
  )
}
