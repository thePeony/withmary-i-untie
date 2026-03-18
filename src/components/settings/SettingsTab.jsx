import { useState } from 'react'
import { useStore } from '../../store.jsx'
import { mysteries } from '../../data/mysteries.js'

export default function SettingsTab() {
  const { state, dispatch } = useStore()
  const { settings, records } = state

  return (
    <div className="settings-tab">
      <section className="settings-section">
        <h2 className="settings-section-title">설정</h2>

        <div className="settings-row">
          <span className="settings-label">다크 모드</span>
          <button
            className={`toggle-switch ${settings.darkMode ? 'toggle-on' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            role="switch"
            aria-checked={settings.darkMode}
            aria-label="다크 모드"
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">기록</h2>

        {records.length === 0 ? (
          <p className="records-empty">아직 완료된 기도가 없습니다.</p>
        ) : (
          <ul className="records-list">
            {records.map((record) => (
              <RecordItem key={record.id} record={record} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function RecordItem({ record }) {
  const [expanded, setExpanded] = useState(false)
  const mysteryLabel = mysteries[record.mysteryKey]?.label ?? record.mysteryKey

  const startDate = record.startedAt
    ? new Date(record.startedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  function truncate(text, maxLen) {
    if (!text) return ''
    return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
  }

  return (
    <li
      className={`record-item ${expanded ? 'record-item--open' : ''}`}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="record-summary">
        <div className="record-meta">
          <span className="record-date">{startDate}</span>
          <span className="record-day">{record.novenaDay}일차</span>
          <span className="record-mystery">{mysteryLabel}</span>
          <span
            className={`record-status ${
              record.completed ? 'record-status--done' : 'record-status--partial'
            }`}
          >
            {record.completed ? '완료' : '미완'}
          </span>
        </div>
        {record.intention && (
          <p className="record-intention-preview">
            {expanded ? record.intention : truncate(record.intention, 40)}
          </p>
        )}
      </div>
    </li>
  )
}
