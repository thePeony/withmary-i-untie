import { mysteries } from '../../data/mysteries.js'
import { getAutoMysteryKey } from '../../data/content.js'

const MYSTERY_KEYS = ['joyful', 'luminous', 'sorrowful', 'glorious']

export default function MysterySelector({ selected, onSelect }) {
  const autoKey = getAutoMysteryKey()

  return (
    <div className="mystery-selector">
      <p className="mystery-selector-hint">오늘의 신비를 선택하세요</p>
      <div className="mystery-options">
        {MYSTERY_KEYS.map((key) => {
          const m = mysteries[key]
          const isAuto = key === autoKey
          return (
            <button
              key={key}
              className={`mystery-option ${selected === key ? 'mystery-option--selected' : ''}`}
              onClick={() => onSelect(key)}
            >
              <span className="mystery-option-name">{m.label}</span>
              <span className="mystery-option-days">{m.weekdays.join('·')}</span>
              {isAuto && <span className="mystery-option-badge">오늘</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
