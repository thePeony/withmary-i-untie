import { useState, useEffect, useRef } from 'react'
import {
  loadHistory, loadSettings, saveSettings,
  exportHistory, importHistory, updateRecord, deleteRecord,
} from '../store/prayerStore'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function formatDate(isoString) {
  const d = new Date(isoString)
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')} (${DAY_LABELS[d.getDay()]})`
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

// 기록을 노베나(9일기도) 세션 단위로 그룹화
// dayNumber === 1 일 때 새 세션 시작으로 판단
function groupHistory(history) {
  if (history.length === 0) return []

  // 오래된 것부터 처리 (history는 최신-우선)
  const oldestFirst = [...history].reverse()
  const groups = []
  let current = null

  for (const record of oldestFirst) {
    if (!current || record.dayNumber === 1) {
      if (current) groups.push(current)
      current = {
        intention: record.intention ?? '',
        records: [record],
      }
    } else {
      current.records.push(record)
      // 지향이 수정됐을 수 있으니 최신 기록 것 사용
      current.intention = record.intention ?? current.intention
    }
  }
  if (current) groups.push(current)

  // 최신 그룹이 앞으로
  return groups.reverse().map(g => ({
    intention: g.records[g.records.length - 1].intention ?? g.records[0].intention ?? '',
    records: [...g.records].reverse(), // 최신-우선
    isComplete: g.records.some(r => r.dayNumber === 9),
  }))
}

export default function SettingsPage() {
  const [history, setHistory] = useState([])
  const [groups, setGroups] = useState([])
  const [expandedGroup, setExpandedGroup] = useState(0) // 첫 번째(최신) 그룹 기본 열림
  const [editingGroup, setEditingGroup] = useState(null) // 편집 중인 그룹 인덱스
  const [editText, setEditText] = useState('')
  const [importError, setImportError] = useState(false)
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  )
  const [settings, setSettings] = useState(() => loadSettings())
  const fileRef = useRef(null)

  useEffect(() => {
    const h = loadHistory()
    setHistory(h)
    setGroups(groupHistory(h))
  }, [])

  function refreshHistory() {
    const h = loadHistory()
    setHistory(h)
    const g = groupHistory(h)
    setGroups(g)
  }

  function toggleDark() {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('withmary_dark', next ? '1' : '0')
  }

  const instructionsVisible = !settings.hideInstructions
  function toggleInstructions() {
    const next = { ...settings, hideInstructions: instructionsVisible }
    setSettings(next)
    saveSettings(next)
  }

  // 지향 수정 — 그룹 내 모든 레코드에 적용
  function startEditGroup(groupIdx) {
    setEditingGroup(groupIdx)
    setEditText(groups[groupIdx].intention)
  }

  function saveEditGroup(groupIdx) {
    const group = groups[groupIdx]
    let h = loadHistory()
    group.records.forEach(r => {
      h = updateRecord(r.completedAt, { intention: editText })
    })
    setHistory(h)
    setGroups(groupHistory(h))
    setEditingGroup(null)
  }

  // 개별 일차 삭제
  function handleDelete(completedAt) {
    const updated = deleteRecord(completedAt)
    setHistory(updated)
    setGroups(groupHistory(updated))
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const merged = importHistory(ev.target.result)
      if (merged) {
        setHistory(merged)
        setGroups(groupHistory(merged))
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

        {groups.length === 0 ? (
          <p className="text-sm text-gray-300 dark:text-gray-600 py-8 text-center">
            완료된 기도가 없습니다.
          </p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {groups.map((group, gIdx) => {
              const isOpen = expandedGroup === gIdx
              const isEditing = editingGroup === gIdx

              return (
                <div key={gIdx}>
                  {/* ── 그룹 헤더: 지향 + 수정 ── */}
                  {isEditing ? (
                    <div className="py-4 space-y-2">
                      <textarea
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        rows={3}
                        autoFocus
                        className="w-full text-sm text-gray-700 dark:text-gray-200 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 resize-none focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => saveEditGroup(gIdx)}
                          className="text-xs text-gray-600 dark:text-gray-300 tracking-wide"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditingGroup(null)}
                          className="text-xs text-gray-300 dark:text-gray-600 tracking-wide"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between py-4">
                      <button
                        onClick={() => setExpandedGroup(isOpen ? null : gIdx)}
                        className="flex-1 text-left"
                      >
                        <span className={[
                          'text-sm',
                          group.intention
                            ? 'text-gray-700 dark:text-gray-200'
                            : 'text-gray-300 dark:text-gray-600 italic',
                        ].join(' ')}>
                          {group.intention || '지향 없음'}
                        </span>
                      </button>
                      <button
                        onClick={() => startEditGroup(gIdx)}
                        className="ml-4 text-xs text-gray-400 dark:text-gray-500 tracking-wide shrink-0"
                      >
                        수정
                      </button>
                    </div>
                  )}

                  {/* ── 펼침: 일차별 날짜 + 삭제 ── */}
                  {isOpen && !isEditing && (
                    <div className="pb-3 space-y-0">
                      {group.records.map((record) => (
                        <div
                          key={record.completedAt}
                          className="flex items-center justify-between py-2.5 border-t border-gray-50 dark:border-gray-800/60"
                        >
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {record.dayNumber}일차
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-300 dark:text-gray-600">
                              {formatDate(record.completedAt)}
                            </span>
                            <button
                              onClick={() => handleDelete(record.completedAt)}
                              className="text-xs text-gray-300 dark:text-gray-600 tracking-wide"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      ))}
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
