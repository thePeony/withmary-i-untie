import { useState } from 'react'
import RosaryBeads from './RosaryBeads'

// 카드 외곽: flex column — 스크롤 영역 + 계속 표시 영역 분리
const CARD_BASE = 'absolute inset-0 top-[60px] bottom-16 flex flex-col animate-fadein'
const CARD_SCROLL = 'flex-1 overflow-y-auto px-6 py-4'

// 타이틀: font-semibold (볼드)
const TITLE_CLASS = 'text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200 mb-3'

// 탭하여 계속: 우측 하단, 스크롤 밖 고정
const CONTINUE_CLASS = 'shrink-0 text-right px-6 pb-3 text-[10px] text-gray-400 dark:text-gray-500 tracking-widest'

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

  // ── 묵주알 카드 — 전체 화면 탭 ───────────────────────────────
  if (block.type === 'rosary') {
    return (
      <div
        className={`${CARD_BASE} cursor-pointer`}
        onClick={(e) => {
          // RosaryBeads 내부 클릭은 RosaryBeads가 처리, 나머지 빈 공간도 동일하게 처리
          if (!e.target.closest('[data-rosary]')) {
            document.querySelector('[data-rosary]')?.click()
          }
        }}
      >
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
        <div className={CARD_SCROLL}>
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
        </div>
        <p className={CONTINUE_CLASS}>계속 ›</p>
      </div>
    )
  }

  // ── 일반 텍스트 카드 ───────────────────────────────────────
  const isInstruction = block.subtype === 'instruction'
  return (
    <div
      className={`${CARD_BASE} cursor-pointer active:opacity-70 transition-opacity`}
      onClick={onTap}
    >
      <div className={CARD_SCROLL}>
        {block.title && <p className={TITLE_CLASS}>{block.title}</p>}
        <div className={`text-sm leading-loose whitespace-pre-line ${
          isInstruction
            ? 'text-gray-700 dark:text-gray-200 font-medium'
            : 'text-gray-600 dark:text-gray-300'
        }`}>
          {renderBody(block.body)}
        </div>
      </div>
      <p className={CONTINUE_CLASS}>계속 ›</p>
    </div>
  )
}
