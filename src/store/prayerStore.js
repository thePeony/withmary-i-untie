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
