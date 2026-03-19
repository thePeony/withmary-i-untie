import { useState } from 'react'
import RosaryBeads from './RosaryBeads'

/**
 * 기도 한 블록을 렌더링하는 컴포넌트
 * type: 'text' | 'rosary'
 * collapsible: true/false
 */
export default function PrayerBlock({ block, onBeadsComplete }) {
  const [open, setOpen] = useState(block.defaultOpen !== false)

  // ── 인라인 태그 처리 (<u> 밑줄) ──────────────────────────
  function renderBody(text) {
    if (!text) return null
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(<u>.*?<\/u>)/g)
      return (
        <span key={i} className="block">
          {parts.map((part, j) => {
            if (part.startsWith('<u>') && part.endsWith('</u>')) {
              return <u key={j}>{part.slice(3, -4)}</u>
            }
            return <span key={j}>{part}</span>
          })}
        </span>
      )
    })
  }

  // ── 내용 렌더 ────────────────────────────────────────────
  function renderContent() {
    if (block.type === 'rosary') {
      return (
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 whitespace-pre-line">
            {/* 성모송 본문은 RosaryBeads 컴포넌트 안에서 보여줌 */}
          </p>
          <RosaryBeads count={block.count} onComplete={onBeadsComplete} blockId={block.id} />
        </div>
      )
    }
    return (
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-loose whitespace-pre-line">
        {renderBody(block.body)}
      </div>
    )
  }

  // ── 접기 가능한 블록 ─────────────────────────────────────
  if (block.collapsible) {
    return (
      <div className="border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between py-4 text-left"
        >
          <span className="text-xs tracking-widest text-gray-400 dark:text-gray-500 uppercase">
            {block.title}
          </span>
          <span className={`text-gray-300 dark:text-gray-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </button>
        {open && (
          <div className="pb-6">
            {renderContent()}
          </div>
        )}
      </div>
    )
  }

  // ── 일반 블록 ────────────────────────────────────────────
  return (
    <div className="py-6 border-b border-gray-100 dark:border-gray-800">
      {block.title && (
        <p className="text-[10px] tracking-widest text-gray-300 dark:text-gray-600 uppercase mb-1">
          {block.title}
        </p>
      )}
      {renderContent()}
    </div>
  )
}
