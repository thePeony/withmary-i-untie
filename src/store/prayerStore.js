/**
 * prayerStore.js
 * localStorage 기반 상태 저장/불러오기
 */

const KEY = 'withmary_prayer_state'
const HISTORY_KEY = 'withmary_history'

// ─── 현재 기도 상태 ──────────────────────────────────────────
export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearState() {
  localStorage.removeItem(KEY)
}

// ─── 설정 ─────────────────────────────────────────────────
const SETTINGS_KEY = 'withmary_settings'

export const DEFAULT_SETTINGS = {
  hideInstructions: false,   // 모든 안내 문구 숨기기
  hideCreedInstruction: false, // 사도신경 안내 숨기기
  hideGloryInstruction: false, // 영광송 안내 숨기기
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

// ─── 기록 ─────────────────────────────────────────────────
export function saveRecord(record) {
  const history = loadHistory()
  history.unshift({ ...record, completedAt: new Date().toISOString() })
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function updateRecord(completedAt, patch) {
  const history = loadHistory()
  const updated = history.map(r =>
    r.completedAt === completedAt ? { ...r, ...patch } : r
  )
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  return updated
}

export function deleteRecord(completedAt) {
  const history = loadHistory()
  const deleted = history.find(r => r.completedAt === completedAt)
  const updated = history.filter(r => r.completedAt !== completedAt)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))

  // 완료 후 대기 중인 휴식 화면과 일치하면 함께 삭제 → PrayerPage에 알림
  const rest = loadRestState()
  if (rest?.completedAt === completedAt) {
    localStorage.removeItem(REST_KEY)
    window.dispatchEvent(new CustomEvent('withmary-rest-cleared'))
  }

  // 진행 중인 세션과 같은 일차/날짜라면 함께 삭제 → PrayerPage에 알림
  if (deleted) {
    const state = loadState()
    if (state) {
      const sameDay =
        new Date(state.date).toDateString() === new Date(completedAt).toDateString()
      if (sameDay && state.dayNumber === deleted.dayNumber) {
        localStorage.removeItem(KEY)
        window.dispatchEvent(new CustomEvent('withmary-session-cleared'))
      }
    }
  }

  return updated
}

// ─── 완료 후 휴식 상태 ────────────────────────────────────────
const REST_KEY = 'withmary_rest'

export function saveRestState(state) {
  localStorage.setItem(REST_KEY, JSON.stringify(state))
}

export function loadRestState() {
  try {
    const raw = localStorage.getItem(REST_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearRestState() {
  localStorage.removeItem(REST_KEY)
}

// 히스토리에서 오늘 완료한 기록이 있으면 restState 동기화
// 가져오기 직후 호출해서 기도탭이 이미 완료 상태임을 인식하게 함
export function syncRestStateFromHistory() {
  const history = loadHistory()
  if (history.length === 0) return

  const latest = history[0]
  const isToday =
    new Date(latest.completedAt).toDateString() === new Date().toDateString()
  if (!isToday) return

  // 이미 restState가 있으면 덮어쓰지 않음
  if (loadRestState()) return

  const rest = {
    dayNumber: latest.dayNumber,
    intention: latest.intention ?? '',
    completedAt: latest.completedAt,
  }
  saveRestState(rest)
  window.dispatchEvent(new CustomEvent('withmary-rest-updated', { detail: rest }))
}

// ─── 기록 내보내기 / 불러오기 ─────────────────────────────────
export function exportHistory() {
  const history = loadHistory()
  const blob = new Blob(
    [JSON.stringify({ version: 1, history }, null, 2)],
    { type: 'application/json' }
  )
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `9일기도 기록_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importHistory(jsonText) {
  try {
    const parsed = JSON.parse(jsonText)
    const incoming = parsed.history ?? parsed  // 버전 래퍼 없는 경우도 허용
    if (!Array.isArray(incoming)) throw new Error('invalid')
    const current = loadHistory()
    // 중복 제거: completedAt 기준
    const existingKeys = new Set(current.map(r => r.completedAt))
    const merged = [
      ...incoming.filter(r => !existingKeys.has(r.completedAt)),
      ...current,
    ].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    localStorage.setItem(HISTORY_KEY, JSON.stringify(merged))
    return merged
  } catch {
    return null  // 실패
  }
}
