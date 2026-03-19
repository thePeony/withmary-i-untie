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
  a.download = `withmary_기도기록_${new Date().toISOString().slice(0, 10)}.json`
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
