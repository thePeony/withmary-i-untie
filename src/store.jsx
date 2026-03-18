import { createContext, useContext, useReducer, useEffect } from 'react'
import { buildFlow } from './data/flowBuilder.js'
import { getAutoMysteryKey } from './data/content.js'

const LS_SESSION = 'withmary_session'
const LS_RECORDS = 'withmary_records'
const LS_SETTINGS = 'withmary_settings'

function loadFromLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

// ── Initial state ────────────────────────────────────────────
const initialState = {
  // 'loading' | 'intro' | 'app'
  appPhase: 'loading',

  // 'prayer' | 'mary' | 'settings'
  activeTab: 'prayer',

  // current prayer session — null means no active session
  session: null,
  /*
    session: {
      id: string,
      novenaDay: 1..9,
      mysteryKey: string,
      stepIndex: number,
      beadCount: number,   // for the current beads step
      intention: string,
      startedAt: ISO string,
      completedAt: ISO string | null,
      completed: boolean,
      flow: Step[]         // computed from buildFlow
    }
  */

  records: [],
  /*
    record: {
      id, novenaDay, mysteryKey, intention,
      startedAt, completedAt, completed
    }
  */

  settings: {
    darkMode: false,
  },
}

// ── Reducer ──────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'INIT': {
      return {
        ...state,
        appPhase: 'loading',
        session: action.session,
        records: action.records,
        settings: action.settings,
      }
    }

    case 'APP_READY': {
      return { ...state, appPhase: 'intro' }
    }

    case 'INTRO_DONE': {
      return { ...state, appPhase: 'app' }
    }

    case 'SET_TAB': {
      return { ...state, activeTab: action.tab }
    }

    case 'START_SESSION': {
      const mysteryKey = action.mysteryKey || getAutoMysteryKey()
      const novenaDay = action.novenaDay
      const flow = buildFlow(mysteryKey, novenaDay)
      const session = {
        id: Date.now().toString(),
        novenaDay,
        mysteryKey,
        stepIndex: 0,
        beadCount: 0,
        intention: action.intention || '',
        startedAt: new Date().toISOString(),
        completedAt: null,
        completed: false,
        flow,
      }
      return { ...state, session }
    }

    case 'RESUME_SESSION': {
      // session already loaded from LS — just keep it
      return state
    }

    case 'DISCARD_SESSION': {
      return { ...state, session: null }
    }

    case 'ADVANCE_STEP': {
      if (!state.session) return state
      const { stepIndex, flow } = state.session
      const nextIndex = stepIndex + 1
      if (nextIndex >= flow.length) {
        // Prayer complete
        const completedSession = {
          ...state.session,
          stepIndex: nextIndex,
          completed: true,
          completedAt: new Date().toISOString(),
        }
        const record = {
          id: completedSession.id,
          novenaDay: completedSession.novenaDay,
          mysteryKey: completedSession.mysteryKey,
          intention: completedSession.intention,
          startedAt: completedSession.startedAt,
          completedAt: completedSession.completedAt,
          completed: true,
        }
        return {
          ...state,
          session: completedSession,
          records: [record, ...state.records],
        }
      }
      return {
        ...state,
        session: { ...state.session, stepIndex: nextIndex, beadCount: 0 },
      }
    }

    case 'TAP_BEAD': {
      if (!state.session) return state
      const newCount = state.session.beadCount + 1
      if (newCount >= 10) {
        // Auto-advance after last bead
        const nextIndex = state.session.stepIndex + 1
        return {
          ...state,
          session: {
            ...state.session,
            stepIndex: nextIndex,
            beadCount: 0,
          },
        }
      }
      return {
        ...state,
        session: { ...state.session, beadCount: newCount },
      }
    }

    case 'SET_INTENTION': {
      if (!state.session || state.session.completed) return state
      return {
        ...state,
        session: { ...state.session, intention: action.intention },
      }
    }

    case 'TOGGLE_DARK_MODE': {
      return {
        ...state,
        settings: { ...state.settings, darkMode: !state.settings.darkMode },
      }
    }

    case 'SET_DARK_MODE': {
      return {
        ...state,
        settings: { ...state.settings, darkMode: action.value },
      }
    }

    default:
      return state
  }
}

// ── Context ──────────────────────────────────────────────────
const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load persisted data on mount
  useEffect(() => {
    const session = loadFromLS(LS_SESSION, null)
    const records = loadFromLS(LS_RECORDS, [])
    const settings = loadFromLS(LS_SETTINGS, { darkMode: false })

    // Rebuild flow if session exists (flow is not serializable due to size, but it's computed)
    let hydratedSession = null
    if (session && !session.completed) {
      try {
        const flow = buildFlow(session.mysteryKey, session.novenaDay)
        hydratedSession = { ...session, flow }
      } catch {
        hydratedSession = null
      }
    }

    dispatch({ type: 'INIT', session: hydratedSession, records, settings })

    // After a short loading delay, show intro
    const timer = setTimeout(() => {
      dispatch({ type: 'APP_READY' })
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  // Persist session when it changes
  useEffect(() => {
    if (state.appPhase === 'loading') return
    if (state.session) {
      // Don't persist the full flow array (too large), strip it
      const { flow: _flow, ...sessionWithoutFlow } = state.session
      saveToLS(LS_SESSION, sessionWithoutFlow)
    } else {
      localStorage.removeItem(LS_SESSION)
    }
  }, [state.session, state.appPhase])

  // Persist records
  useEffect(() => {
    if (state.appPhase === 'loading') return
    saveToLS(LS_RECORDS, state.records)
  }, [state.records, state.appPhase])

  // Persist settings
  useEffect(() => {
    if (state.appPhase === 'loading') return
    saveToLS(LS_SETTINGS, state.settings)
  }, [state.settings, state.appPhase])

  // Apply dark mode to document
  useEffect(() => {
    if (state.settings.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [state.settings.darkMode])

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}

// Helper to get next novena day based on records
export function getNextNovenaDay(records) {
  if (!records || records.length === 0) return 1
  const completedDays = records.filter((r) => r.completed).map((r) => r.novenaDay)
  if (completedDays.length === 0) return 1
  const lastCompleted = Math.max(...completedDays)
  if (lastCompleted >= 9) return 1 // Start new cycle
  return lastCompleted + 1
}
