import { useState, useEffect, useRef } from 'react'
import { loadHistory, loadSettings, saveSettings, exportHistory, importHistory, updateRecord } from '../store/prayerStore'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function formatDate(isoString) {
  const d = new Date(isoString)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${DAY_LABELS[d.getDay()]})`
}

// on = 보이는 상태 (켜짐 = 색 채움)
function ToggleRow({ label, on, onToggle, last = false }) {
  return (
    <div className={`flex items-center justify-between py-4 ${last ? '' : 'border-b border-gray-100 dark:border-gray-800'}`}>
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      <button
        onClick={onToggle}
        className={[
          'w-12 h-6 rounded-full transition-colors duration-300 relative',
          on ? 'bg-gray-800 dark:bg-gray-200' : 'bg-gray-200 dark:bg-gray-700',
        ].join(' ')}
      >
        <span className={[
          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300',
          on ? 'translate-x-7' : 'translate-x-1',
        ].join(' ')} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [history, setHistory] = useState([])
  const [expandedIdx, setExpandedIdx] = useState(null)
  const [editingAt, setEditingAt] = useState(null)   // completedAt of record being edited
  const [editText, setEditText] = useState('')
  const [importError, setImportError] = useState(false)
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  )
  const [settings, setSettings] = useState(() => loadSettings())
  const fileRef = useRef(null)

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  function toggleDark() {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('withmary_dark', next ? '1' : '0')
  }

  // 토글: on = 안내 문구가 보이는 상태 → hideInstructions는 반대
  const instructionsVisible = !settings.hideInstructions
  function toggleInstructions() {
    const next = { ...settings, hideInstructions: instructionsVisible }  // 보이면 → 숨김으로
    setSettings(next)
    saveSettings(next)
  }

  function startEdit(record) {
    setEditingAt(record.completedAt)
    setEditText(record.intention ?? '')
    setExpandedIdx(null)
  }

  function saveEdit(completedAt) {
    const updated = updateRecord(completedAt, { intention: editText })
    setHistory(updated)
    setEditingAt(null)
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const merged = importHistory(ev.target.result)
      if (merged) {
        setHistory(merged)
        setImportError(false)
      } else {
        setImportError(true)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="min-h-screen pt-8 px-6 pb-20">

      {/* 설정 */}
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.3em] text-gray-300 dark:text-gray-600 uppercase mb-4">
          설정
        </p>
        <ToggleRow label="다크 모드" on={darkMode} onToggle={toggleDark} />
        <ToggleRow
          label="안내 문구 보이기"
          on={instructionsVisible}
          onToggle={toggleInstructions}
          last
        />
      </div>

      {/* 기도 기록 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] tracking-[0.3em] text-gray-300 dark:text-gray-600 uppercase">
            기도 기록
          </p>
          <div className="flex gap-3">
            <button
              onClick={exportHistory}
              className="text-[10px] tracking-widest text-gray-400 dark:text-gray-500"
            >
              내보내기
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-[10px] tracking-widest text-gray-400 dark:text-gray-500"
            >
              불러오기
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </div>

        {importError && (
          <p className="text-xs text-red-400 mb-3">파일을 읽을 수 없습니다.</p>
        )}

        {history.length === 0 ? (
          <p className="text-sm text-gray-300 dark:text-gray-600 py-8 text-center">
            완료된 기도가 없습니다.
          </p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {history.map((record, idx) => {
              const isExpanded = expandedIdx === idx
              const isEditing = editingAt === record.completedAt

              return (
                <div key={record.completedAt}>
                  {/* 행: 일차 + 날짜 */}
                  <button
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                      {record.dayNumber}일차
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(record.completedAt)}
                    </span>
                  </button>

                  {/* 펼침: 지향 + 수정 */}
                  {isExpanded && (
                    <div className="pb-4 space-y-2">
                      {isEditing ? (
                        <>
                          <textarea
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            rows={3}
                            className="w-full text-sm text-gray-700 dark:text-gray-200 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 resize-none focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => saveEdit(record.completedAt)}
                              className="text-xs text-gray-600 dark:text-gray-300 tracking-wide"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => setEditingAt(null)}
                              className="text-xs text-gray-300 dark:text-gray-600 tracking-wide"
                            >
                              취소
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-loose">
                            {record.intention || <span className="text-gray-300 dark:text-gray-600 italic">지향 없음</span>}
                          </p>
                          <button
                            onClick={() => startEdit(record)}
                            className="text-xs text-gray-400 dark:text-gray-500 tracking-wide"
                          >
                            수정
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
