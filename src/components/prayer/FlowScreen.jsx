import { useStore } from '../../store.jsx'
import RosaryBeads from './RosaryBeads.jsx'
import CollapsibleBlock from './CollapsibleBlock.jsx'
import PrayerText from './PrayerText.jsx'

export default function FlowScreen() {
  const { state, dispatch } = useStore()
  const { session } = state

  if (!session || !session.flow) return null

  const step = session.flow[session.stepIndex]
  if (!step) return <CompletedScreen />

  if (step.type === 'beads') {
    return <RosaryBeads step={step} />
  }

  return <StepScreen step={step} />
}

function StepScreen({ step }) {
  const { dispatch } = useStore()

  const advance = () => dispatch({ type: 'ADVANCE_STEP' })

  const isInstruction = step.type === 'instruction'
  const isMystery = step.type === 'mystery_announcement'
  const isNovenaTitle = step.type === 'novena_title'
  const isNovenaPrayer = step.type === 'novena_prayer'
  const isFinalSign = step.type === 'final_sign_of_cross'

  return (
    <div
      className={`flow-screen ${isInstruction ? 'flow-screen--instruction' : ''}`}
      onClick={advance}
      role="main"
      aria-label="기도 흐름 (탭하여 진행)"
    >
      {/* Section label */}
      {step.section && (
        <p className="flow-section-label">{step.section}</p>
      )}

      {/* Main content */}
      <div className="flow-content" onClick={(e) => e.stopPropagation()}>

        {isMystery ? (
          <MysteryBlock step={step} />
        ) : isNovenaTitle ? (
          <NovenaTitleBlock step={step} />
        ) : isNovenaPrayer ? (
          <NovenaPrayerBlock step={step} />
        ) : isFinalSign ? (
          <FinalBlock step={step} />
        ) : (
          <DefaultBlock step={step} />
        )}

      </div>

      {/* Tap-to-advance hint at bottom */}
      <div className="flow-advance-hint" aria-hidden="true">
        <span className="advance-dot" />
        <span className="advance-dot" />
        <span className="advance-dot" />
      </div>
    </div>
  )
}

function DefaultBlock({ step }) {
  return (
    <>
      <h2 className="flow-title">{step.title}</h2>
      {step.subtitle && <p className="flow-subtitle">{step.subtitle}</p>}
      <div className="flow-body">
        <PrayerText body={step.body} underline={step.underline} />
      </div>
    </>
  )
}

function MysteryBlock({ step }) {
  return (
    <>
      <div className="mystery-badge">{step.mysteryLabel}</div>
      <h2 className="flow-title mystery-title">{step.title}</h2>

      {step.descriptionBlock && (
        <CollapsibleBlock
          title={step.descriptionBlock.title}
          defaultOpen={step.descriptionBlock.defaultOpen}
        >
          <p className="collapsible-text">{step.descriptionBlock.body}</p>
        </CollapsibleBlock>
      )}

      {step.scriptureBlock && (
        <CollapsibleBlock
          title={step.scriptureBlock.title}
          defaultOpen={step.scriptureBlock.defaultOpen}
        >
          <blockquote className="scripture-quote">
            <p>{step.scriptureBlock.quote}</p>
            <cite className="scripture-source">— {step.scriptureBlock.source}</cite>
          </blockquote>
          <div className="meditation-text">
            {step.scriptureBlock.meditation.split('\n').map((line, i) => (
              <p key={i}>{line || '\u00A0'}</p>
            ))}
          </div>
        </CollapsibleBlock>
      )}
    </>
  )
}

function NovenaTitleBlock({ step }) {
  return (
    <>
      <div className="novena-badge">9일기도</div>
      <h2 className="flow-title">{step.title}</h2>
      <p className="novena-mystery-label">{step.mysterySetLabel}</p>
    </>
  )
}

function NovenaPrayerBlock({ step }) {
  const { dispatch } = useStore()
  return (
    // Novena prayer is always shown, never collapsed, tap to advance
    <div onClick={() => dispatch({ type: 'ADVANCE_STEP' })}>
      <h2 className="flow-title">{step.title}</h2>
      <div className="flow-body novena-body">
        {step.body.split('\n').map((line, i) => (
          <p key={i} className={line.startsWith('착한') || line.startsWith('매듭을 푸는') ? 'novena-refrain' : 'prayer-line'}>
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    </div>
  )
}

function FinalBlock({ step }) {
  return (
    <>
      <h2 className="flow-title final-title">{step.title}</h2>
      <div className="flow-body">
        <PrayerText body={step.body} underline={step.underline} />
      </div>
    </>
  )
}

function CompletedScreen() {
  const { dispatch } = useStore()

  return (
    <div className="completed-screen">
      <div className="completed-content">
        <div className="completed-icon" aria-hidden="true">✦</div>
        <h2 className="completed-title">기도를 마쳤습니다</h2>
        <p className="completed-body">
          성모님의 전구로 당신의 매듭이 풀리기를 기도합니다.
        </p>
        <button
          className="btn-primary"
          onClick={() => dispatch({ type: 'DISCARD_SESSION' })}
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  )
}
