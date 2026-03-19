import { useState } from 'react'
import RosaryBeads from './RosaryBeads'

/**
 * 기도 한 블록
 * isActive: 현재 진행 중인 블록
 * onTap: 탭하면 다음으로 (text 타입만)
 * onBeadsComplete: 묵주알 10개 완료 시
 */
export default function PrayerBlock({ block, isActive, onTap, onBeadsComplete }) {
  const [open, setOpen] = useState(block.defaultOpen !== false)

  // <u>...</u> 처리
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

  function renderContent() {
    if (block.type === 'rosary') {
      return (
        <div className="mt-4">
          <RosaryBeads count={block.count} onComplete={onBeadsComplete} blockId={block.id} />
        </div>
      )
    }
    return (
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-loose whitespace-pre-line">
        {renderBody(block.body)}
      </div>
    )
  }

  // ── 접기 블록 ─────────────────────────────────────────────
  if (block.collapsible) {
    return (
      <div
        className={`border-b border-gray-100 dark:border-gray-800 ${isActive && block.type !== 'rosary' ? 'cursor-pointer' : ''}`}
        onClick={isActive && block.type !== 'rosary' ? (e) => {
          // 접기 버튼 클릭은 토글만, 나머지 영역 탭은 진행
          if (e.target.closest('[data-toggle]')) return
          onTap?.()
        } : undefined}
      >
        <div
          data-toggle
          className="flex items-center justify-between py-4"
          onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        >
          <span className="text-base tracking-wide text-gray-600 dark:text-gray-300 font-medium">
            {block.title}
          </span>
          <span className={`text-gray-300 dark:text-gray-600 transition-transform duration-300 text-xs ${open ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </div>
        {open && (
          <div className="pb-5">
            {renderContent()}
          </div>
        )}
        {isActive && block.type !== 'rosary' && (
          <p className="text-center text-[10px] text-gray-200 dark:text-gray-700 tracking-widest pb-4">
            탭하여 계속
          </p>
        )}
      </div>
    )
  }

  // ── 일반 블록 ─────────────────────────────────────────────
  return (
    <div
      className={[
        'py-6 border-b border-gray-100 dark:border-gray-800',
        isActive && block.type !== 'rosary' ? 'cursor-pointer active:opacity-70' : '',
      ].join(' ')}
      onClick={isActive && block.type !== 'rosary' ? onTap : undefined}
    >
      {block.title && (
        <p className="text-base tracking-wide text-gray-600 dark:text-gray-300 mb-2 font-medium">
          {block.title}
        </p>
      )}
      {renderContent()}
      {isActive && block.type !== 'rosary' && (
        <p className="text-[10px] text-gray-200 dark:text-gray-700 tracking-widest mt-4">
          탭하여 계속 ↓
        </p>
      )}
    </div>
  )
}
