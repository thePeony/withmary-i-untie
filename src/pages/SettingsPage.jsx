import { useState, useEffect } from 'react'
import { loadHistory } from '../store/prayerStore'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function formatDate(isoString) {
  const d = new Date(isoString)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${DAY_LABELS[d.getDay()]})`
}

export default function SettingsPage() {
  const [history, setHistory] = useState([])
  const [expandedIdx, setExpandedIdx] = useState(null)
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  function toggleDark() {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('withmary_dark', next ? '1' : '0')
  }

  return (
    <div className="min-h-screen pt-8 px-6 pb-24">
      {/* 설정 */}
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.3em] text-gray-300 dark:text-gray-600 uppercase mb-4">
          설정
        </p>
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm text-gray-600 dark:text-gray-300">다크 모드</span>
          <button
            onClick={toggleDark}
            className={[
              'w-12 h-6 rounded-full transition-colors duration-300 relative',
              darkMode ? 'bg-gray-800' : 'bg-gray-200',
            ].join(' ')}
          >
            <span className={[
              'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300',
              darkMode ? 'translate-x-7' : 'translate-x-1',
            ].join(' ')} />
          </button>
        </div>
      </div>

      {/* 기록 */}
      <div>
        <p className="text-[10px] tracking-[0.3em] text-gray-300 dark:text-gray-600 uppercase mb-4">
          기도 기록
        </p>

        {history.length === 0 ? (
          <p className="text-sm text-gray-300 dark:text-gray-600 py-8 text-center">
            완료된 기도가 없습니다.
          </p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {history.map((record, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      {record.dayNumber}일차
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {formatDate(record.completedAt)}
                    </p>
                    {record.intention && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[240px] mt-0.5 italic">
                        "{record.intention}"
                      </p>
                    )}
                  </div>
                  <span className={`text-gray-300 dark:text-gray-600 text-xs transition-transform duration-300 ${expandedIdx === idx ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>

                {expandedIdx === idx && record.intention && (
                  <div className="pb-4 text-sm text-gray-600 dark:text-gray-300 leading-loose italic">
                    "{record.intention}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
