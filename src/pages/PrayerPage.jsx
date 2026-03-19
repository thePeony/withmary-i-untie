import { useState, useEffect, useCallback } from 'react'
import { buildFlow } from '../data/flowBuilder'
import FlowScreen from '../components/prayer/FlowScreen'
import { saveState, loadState, clearState, saveRecord, loadSettings } from '../store/prayerStore'

export default function PrayerPage() {
  const [session, setSession] = useState(null)   // { dayNumber, date, blocks, currentIndex, intention }
  const [resumePrompt, setResumePrompt] = useState(false)
  const [savedState, setSavedState] = useState(null)

  // 앱 시작 시 저장된 상태 확인
  useEffect(() => {
    const s = loadState()
    if (s && s.currentIndex < s.totalBlocks && s.currentIndex > 0) {
      setSavedState(s)
      setResumePrompt(true)
    }
  }, [])

  // 새 기도 시작
  function startNew(dayNumber = 1, intention = '') {
    const date = new Date()
    const settings = loadSettings()
    const blocks = buildFlow(dayNumber, date, settings)
    const newSession = {
      dayNumber,
      date: date.toISOString(),
      blocks,
      currentIndex: 0,
      intention,
      totalBlocks: blocks.length,
    }
    setSession(newSession)
    saveState({ ...newSession, blocks: undefined, totalBlocks: blocks.length })
    setResumePrompt(false)
  }

  // 재개
  function resume() {
    if (!savedState) return
    const date = new Date(savedState.date)
    const settings = loadSettings()
    const blocks = buildFlow(savedState.dayNumber, date, settings)
    setSession({ ...savedState, blocks })
    setResumePrompt(false)
  }

  // 다음 블록으로
  const advance = useCallback(() => {
    if (!session) return
    const next = session.currentIndex + 1
    const updated = { ...session, currentIndex: next }
    setSession(updated)
    saveState({ ...updated, blocks: undefined })
    if (next >= session.blocks.length) {
      saveRecord({ dayNumber: session.dayNumber, date: session.date, intention: session.intention })
      clearState()
    }
  }, [session])

  // 이전 블록으로
  const goBack = useCallback(() => {
    if (!session || session.currentIndex <= 0) return
    const prev = session.currentIndex - 1
    const updated = { ...session, currentIndex: prev }
    setSession(updated)
    saveState({ ...updated, blocks: undefined })
  }, [session])

  // ── 재개 프롬프트 ─────────────────────────────────────────
  if (resumePrompt && savedState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-8">
        <div className="text-center space-y-2">
          <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500">
            이전 기도를 이어서
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {savedState.dayNumber}일차 · {savedState.currentIndex}번째 단계에서 멈췄습니다
          </p>
          {savedState.intention && (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-1">
              "{savedState.intention}"
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={resume}
            className="w-full py-4 text-sm tracking-widest text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            계속
          </button>
          <button
            onClick={() => { clearState(); setResumePrompt(false) }}
            className="w-full py-4 text-sm tracking-widest text-gray-400 dark:text-gray-500"
          >
            처음부터
          </button>
        </div>
      </div>
    )
  }

  // ── 기도 시작 화면 ────────────────────────────────────────
  if (!session) {
    return <StartScreen onStart={startNew} />
  }

  // ── 기도 흐름 화면 ────────────────────────────────────────
  return (
    <FlowScreen
      blocks={session.blocks}
      currentIndex={session.currentIndex}
      onAdvance={advance}
      onBack={goBack}
    />
  )
}

// ─── 시작 화면 (지향 입력 + 날짜 선택) ───────────────────────
function StartScreen({ onStart }) {
  const [day, setDay] = useState(1)
  const [intention, setIntention] = useState('')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-10">
      <div className="text-center space-y-2">
        <p className="text-xs tracking-[0.3em] text-gray-300 dark:text-gray-600 uppercase">
          매듭을 푸시는 성모님
        </p>
        <p className="text-lg font-light text-gray-700 dark:text-gray-200">
          9일기도
        </p>
      </div>

      <div className="w-full max-w-xs space-y-6">
        {/* 일차 선택 */}
        <div>
          <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500 mb-2">일차</p>
          <div className="grid grid-cols-9 gap-1">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={[
                  'py-2 text-sm rounded transition-colors',
                  day === d
                    ? 'bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900'
                    : 'text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-800',
                ].join(' ')}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* 지향 입력 */}
        <div>
          <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500 mb-2">지향 (선택)</p>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="기도 지향을 적어 주세요"
            rows={3}
            className={[
              'w-full text-sm text-gray-700 dark:text-gray-200 resize-none',
              'bg-transparent border border-gray-100 dark:border-gray-800 rounded-lg',
              'p-3 placeholder:text-gray-200 dark:placeholder:text-gray-700',
              'focus:outline-none focus:border-gray-300 dark:focus:border-gray-600',
            ].join(' ')}
          />
        </div>

        <button
          onClick={() => onStart(day, intention)}
          className="w-full py-4 text-sm tracking-widest text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg active:opacity-50 transition-opacity"
        >
          기도 시작
        </button>
      </div>
    </div>
  )
}
