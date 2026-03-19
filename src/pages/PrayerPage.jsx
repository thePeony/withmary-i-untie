import { useState, useEffect, useCallback } from 'react'
import { buildFlow } from '../data/flowBuilder'
import FlowScreen from '../components/prayer/FlowScreen'
import {
  saveState, loadState, clearState, saveRecord, loadSettings,
  saveRestState, loadRestState, clearRestState, loadHistory,
} from '../store/prayerStore'

// 기도 완료 다음날 0시 계산
function nextMidnightAfter(isoString) {
  const d = new Date(isoString)
  const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
  return midnight
}

function isPastMidnight(isoString) {
  return new Date() >= nextMidnightAfter(isoString)
}

// 히스토리 기반으로 StartScreen 초기값 계산
function calcNextStart(rest) {
  if (!rest) return null
  if (rest.dayNumber >= 9) return null // 9일차 완료 → 첫 화면
  // 히스토리에서 가장 최근 지향 확인 (편집했을 수 있으므로)
  const history = loadHistory()
  const last = history[0]
  const intention = last?.intention ?? rest.intention ?? ''
  return { day: rest.dayNumber + 1, intention }
}

export default function PrayerPage() {
  const [session, setSession] = useState(null)
  const [resumePrompt, setResumePrompt] = useState(false)
  const [savedState, setSavedState] = useState(null)
  const [restState, setRestState] = useState(null)
  const [nextStart, setNextStart] = useState(null)

  // SettingsPage에서 기록 삭제 시 이벤트 수신 → React 상태 초기화
  useEffect(() => {
    function onRestCleared() {
      setRestState(null)
      setNextStart(null)
    }
    function onSessionCleared() {
      setSession(null)
      setSavedState(null)
      setResumePrompt(false)
    }
    function onRestUpdated(e) {
      setRestState(e.detail)
      setSession(null)
      setResumePrompt(false)
      setNextStart(null)
    }
    // 기록 삭제 시 항상 발생 — restState가 이미 없어도 nextStart 재계산
    function onHistoryChanged(e) {
      const remaining = e.detail
      const currentRest = loadRestState()
      if (!currentRest) {
        // rest 없음: 남은 기록 기반으로 nextStart 재계산
        if (remaining.length === 0) {
          setNextStart(null)
        } else {
          const latest = remaining[0]
          if (latest.dayNumber < 9) {
            setNextStart({ day: latest.dayNumber + 1, intention: latest.intention ?? '' })
          } else {
            setNextStart(null)
          }
        }
      }
    }
    window.addEventListener('withmary-rest-cleared', onRestCleared)
    window.addEventListener('withmary-session-cleared', onSessionCleared)
    window.addEventListener('withmary-rest-updated', onRestUpdated)
    window.addEventListener('withmary-history-changed', onHistoryChanged)
    return () => {
      window.removeEventListener('withmary-rest-cleared', onRestCleared)
      window.removeEventListener('withmary-session-cleared', onSessionCleared)
      window.removeEventListener('withmary-rest-updated', onRestUpdated)
      window.removeEventListener('withmary-history-changed', onHistoryChanged)
    }
  }, [])

  // 마운트 시: restState 로드 + 이미 자정 지났으면 즉시 처리
  useEffect(() => {
    const rest = loadRestState()
    if (!rest) return

    if (isPastMidnight(rest.completedAt)) {
      // 이미 0시 지남 → RestScreen 생략, 바로 다음 일차로
      clearRestState()
      setNextStart(calcNextStart(rest))
    } else {
      setRestState(rest)
    }
  }, [])

  useEffect(() => {
    const s = loadState()
    if (s && s.currentIndex < s.totalBlocks && s.currentIndex > 0) {
      setSavedState(s)
      setResumePrompt(true)
    }
  }, [])

  function startNew(dayNumber = 1, intention = '') {
    const date = new Date()
    const settings = loadSettings()
    const blocks = buildFlow(dayNumber, date, settings, intention)
    const newSession = {
      dayNumber, date: date.toISOString(), blocks,
      currentIndex: 0, intention, totalBlocks: blocks.length,
    }
    setSession(newSession)
    saveState({ ...newSession, blocks: undefined, totalBlocks: blocks.length })
    setResumePrompt(false)
    clearRestState()
    setRestState(null)
    setNextStart(null)
  }

  function resume() {
    if (!savedState) return
    const date = new Date(savedState.date)
    const settings = loadSettings()
    const blocks = buildFlow(savedState.dayNumber, date, settings, savedState.intention ?? '')
    setSession({ ...savedState, blocks })
    setResumePrompt(false)
  }

  const advance = useCallback(() => {
    if (!session) return
    const next = session.currentIndex + 1
    const updated = { ...session, currentIndex: next }
    setSession(updated)
    saveState({ ...updated, blocks: undefined })
    if (next >= session.blocks.length) {
      saveRecord({ dayNumber: session.dayNumber, date: session.date, intention: session.intention })
      const rest = { dayNumber: session.dayNumber, intention: session.intention, completedAt: new Date().toISOString() }
      saveRestState(rest)
      setRestState(rest)
      clearState()
      setSession(null)
    }
  }, [session])

  const goBack = useCallback(() => {
    if (!session || session.currentIndex <= 0) return
    const prev = session.currentIndex - 1
    const updated = { ...session, currentIndex: prev }
    setSession(updated)
    saveState({ ...updated, blocks: undefined })
  }, [session])

  // 자정에 RestScreen 자동 종료
  function handleMidnightDismiss() {
    const rest = restState
    clearRestState()
    setRestState(null)
    setNextStart(calcNextStart(rest))
  }

  // ── 완료 후 쉬는 화면 ─────────────────────────────────────
  if (restState && !session && !resumePrompt) {
    return (
      <RestScreen
        restState={restState}
        onMidnight={handleMidnightDismiss}
      />
    )
  }

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

  if (!session) return (
    <StartScreen
      onStart={startNew}
      initialDay={nextStart?.day}
      initialIntention={nextStart?.intention}
    />
  )

  return (
    <FlowScreen
      blocks={session.blocks}
      currentIndex={session.currentIndex}
      onAdvance={advance}
      onBack={goBack}
    />
  )
}

// ─── 완료 후 쉬는 화면 ───────────────────────────────────────
function RestScreen({ restState, onMidnight }) {
  const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']
  const d = new Date(restState.completedAt)
  const dateStr = `${d.getMonth() + 1}월 ${d.getDate()}일 (${DAY_LABELS[d.getDay()]})`

  // 다음날 0시에 자동 전환
  useEffect(() => {
    const midnight = nextMidnightAfter(restState.completedAt)
    const msUntil = midnight - Date.now()
    if (msUntil <= 0) { onMidnight(); return }
    const timer = setTimeout(onMidnight, msUntil)
    return () => clearTimeout(timer)
  }, [restState.completedAt, onMidnight])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 pb-20">
      <div className="text-center space-y-5 max-w-xs w-full">
        <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500">
          기도 완료
        </p>

        <div className="space-y-1">
          <p className="text-2xl font-light text-gray-700 dark:text-gray-200">
            {restState.dayNumber}일차
          </p>
          <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500">{dateStr}</p>
        </div>

        {restState.intention && (
          <p className="intention-text text-sm leading-loose italic border-t border-gray-100 dark:border-gray-800 pt-5">
            "{restState.intention}"
          </p>
        )}

        <p className="text-sm text-gray-400 dark:text-gray-500 tracking-wide pt-2">
          내일 만나요
        </p>
      </div>
    </div>
  )
}

// ─── 시작 화면 ───────────────────────────────────────────────
function StartScreen({ onStart, initialDay, initialIntention }) {
  const [day, setDay] = useState(initialDay ?? 1)
  const [intention, setIntention] = useState(initialIntention ?? '')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-10">
      <div className="text-center space-y-2">
        <p className="text-sm tracking-[0.3em] text-[#8b6f62] dark:text-[#c4a08a]">
          매듭을 푸시는 성모님
        </p>
        <p className="text-lg font-light text-gray-700 dark:text-gray-200">
          9일기도
        </p>
      </div>

      <div className="w-full max-w-xs space-y-6">
        <div>
          <p className="text-sm tracking-widest text-[#8b6f62] dark:text-[#c4a08a] mb-2">일차</p>
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

        <div>
          <p className="text-sm tracking-widest text-[#8b6f62] dark:text-[#c4a08a] mb-2">지향 (선택)</p>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="기도 지향을 적어 주세요"
            rows={3}
            className={[
              'w-full text-sm text-gray-700 dark:text-gray-200 resize-none',
              'bg-transparent border border-gray-100 dark:border-gray-800 rounded-lg',
              'p-3 placeholder:text-[#8b6f62]/40 dark:placeholder:text-[#c4a08a]/30',
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
