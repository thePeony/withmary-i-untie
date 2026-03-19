import { useState } from 'react'
import RosaryBeads from './RosaryBeads'

const CARD_BASE = 'absolute inset-0 top-[52px] bottom-24 overflow-y-auto px-6 py-4 animate-fadein'

// 타이틀: 본문(text-sm)과 동일 크기, 굵기만 medium
const TITLE_CLASS = 'text-sm font-medium tracking-wide text-gray-700 dark:text-gray-200 mb-3'

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
      <div className={CARD_BASE}>
        <p className={TITLE_CLASS}>{block.title}</p>
        <RosaryBeads count={block.count} onComplete={onBeadsComplete} blockId={block.id} />
      </div>
    )
  }

  // ── 접기 카드 ──────────────────────────────────────────────
  if (block.collapsible) {
    return (
      <div
        className={`${CARD_BASE} cursor-pointer`}
        onClick={(e) => {
          if (e.target.closest('[data-toggle]')) return
          onTap?.()
        }}
      >
        <div
          data-toggle
          className="flex items-center justify-between mb-3"
          onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        >
          <p className={TITLE_CLASS}>{block.title}</p>
          <span className={`text-gray-300 dark:text-gray-600 text-xs transition-transform duration-300 ml-2 shrink-0 ${open ? 'rotate-180' : ''}`}>
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
      className={`${CARD_BASE} cursor-pointer active:opacity-70 transition-opacity`}
      onClick={onTap}
    >
      {block.title && (
        <p className={TITLE_CLASS}>{block.title}</p>
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
