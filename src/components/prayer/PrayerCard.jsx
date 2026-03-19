import { useState } from 'react'
import RosaryBeads from './RosaryBeads'

// 카드 외곽: flex column — animate-fadein은 CARD_SCROLL에만 (계속 › 는 페이드 제외)
const CARD_BASE = 'absolute inset-0 top-[60px] bottom-16 flex flex-col'
const CARD_SCROLL = 'flex-1 overflow-y-auto px-6 pt-3 pb-4'

// 타이틀: font-bold
const TITLE_CLASS = 'text-sm font-bold tracking-wide text-gray-700 dark:text-gray-200 mb-3'

// 탭하여 계속: 우측 하단, 스크롤 밖 고정
const CONTINUE_CLASS = 'shrink-0 text-right px-6 pb-3 text-[10px] text-gray-400 dark:text-gray-500 tracking-widest'

export default function PrayerCard({ block, onTap, onBeadsComplete }) {
  const [open, setOpen] = useState(block.defaultOpen !== false)

  function renderInline(text) {
    return text.split(/(<u>.*?<\/u>|<b>.*?<\/b>)/g).map((chunk, j) => {
      if (chunk.startsWith('<u>') && chunk.endsWith('</u>')) return <u key={j}>{chunk.slice(3, -4)}</u>
      if (chunk.startsWith('<b>') && chunk.endsWith('</b>')) return <strong key={j} className="font-bold">{chunk.slice(3, -4)}</strong>
      return <span key={j}>{chunk}</span>
    })
  }

  function renderBody(text) {
    if (!text) return null
    return text.split('\n').map((line, i) => {
      if (line === '') return <span key={i} className="block mt-3" />
      return <span key={i} className="block">{renderInline(line)}</span>
    })
  }

  // ── 묵주알 카드 — 전체 화면 탭 ───────────────────────────────
  if (block.type === 'rosary') {
    return (
      <div
        className={`${CARD_BASE} cursor-pointer`}
        onClick={(e) => {
          if (!e.target.closest('[data-rosary]')) {
            document.querySelector('[data-rosary]')?.click()
          }
        }}
      >
        <div className={CARD_SCROLL}>
          <p className={TITLE_CLASS}>{block.title}</p>
          <RosaryBeads count={block.count} onComplete={onBeadsComplete} blockId={block.id} />
        </div>
      </div>
    )
  }

  // ── 신비 선포 카드 (parts 구조) ───────────────────────────────
  if (block.parts) {
    return (
      <div
        className={`${CARD_BASE} cursor-pointer active:opacity-70 transition-opacity`}
        onClick={onTap}
      >
        <div className={CARD_SCROLL}>
          {block.title && <p className={TITLE_CLASS}>{block.title}</p>}
          <div className="text-sm text-gray-600 dark:text-gray-300 leading-loose">
            {block.parts.map((part, i) => {
              if (part.type === 'title') return (
                <p key={i} className="font-semibold text-gray-700 dark:text-gray-200 whitespace-pre-line">
                  {renderInline(part.text)}
                </p>
              )
              if (part.type === 'quote') return (
                <p key={i} className="whitespace-pre-line mt-6">
                  {renderInline(part.text)}
                </p>
              )
              if (part.type === 'source') return (
                <p key={i} className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                  {renderInline(part.text)}
                </p>
              )
              if (part.type === 'meditation') return (
                <p key={i} className="whitespace-pre-line mt-6">
                  {renderInline(part.text)}
                </p>
              )
              return null
            })}
          </div>
        </div>
        <p className={CONTINUE_CLASS}>계속 ›</p>
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
        <div className="text-sm leading-loose whitespace-pre-line text-gray-600 dark:text-gray-300">
          {renderBody(block.body)}
        </div>
      </div>
      <p className={CONTINUE_CLASS}>계속 ›</p>
    </div>
  )
}
