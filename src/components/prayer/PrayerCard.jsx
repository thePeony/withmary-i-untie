import { useState } from 'react'
import RosaryBeads from './RosaryBeads'

export default function PrayerCard({ block, onTap, onBeadsComplete }) {
  const [open, setOpen] = useState(block.defaultOpen !== false)

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

  // ── 묵주알 카드 ────────────────────────────────────────────
  if (block.type === 'rosary') {
    return (
      <div className="absolute inset-0 top-[72px] bottom-24 overflow-y-auto px-6 py-4">
        <p className="text-base tracking-wide text-gray-600 dark:text-gray-300 font-medium mb-4">
          {block.title}
        </p>
        <RosaryBeads count={block.count} onComplete={onBeadsComplete} blockId={block.id} />
      </div>
    )
  }

  // ── 접기 카드 ──────────────────────────────────────────────
  if (block.collapsible) {
    return (
      <div
        className="absolute inset-0 top-[72px] bottom-24 overflow-y-auto px-6 py-4 cursor-pointer"
        onClick={(e) => {
          if (e.target.closest('[data-toggle]')) return
          onTap?.()
        }}
      >
        <div
          data-toggle
          className="flex items-center justify-between mb-4"
          onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        >
          <p className="text-base tracking-wide text-gray-600 dark:text-gray-300 font-medium">
            {block.title}
          </p>
          <span className={`text-gray-300 dark:text-gray-600 text-xs transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </div>

        {open && (
          <div className="text-sm text-gray-600 dark:text-gray-300 leading-loose whitespace-pre-line">
            {renderBody(block.body)}
          </div>
        )}

        <p className="text-[10px] text-gray-200 dark:text-gray-700 tracking-widest mt-6">
          탭하여 계속 ↓
        </p>
      </div>
    )
  }

  // ── 일반 텍스트 카드 ───────────────────────────────────────
  return (
    <div
      className="absolute inset-0 top-[72px] bottom-24 overflow-y-auto px-6 py-4 cursor-pointer active:opacity-70 transition-opacity"
      onClick={onTap}
    >
      {block.title && (
        <p className="text-base tracking-wide text-gray-600 dark:text-gray-300 font-medium mb-3">
          {block.title}
        </p>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-300 leading-loose whitespace-pre-line">
        {renderBody(block.body)}
      </div>

      <p className="text-[10px] text-gray-200 dark:text-gray-700 tracking-widest mt-6">
        탭하여 계속 ↓
      </p>
    </div>
  )
}
