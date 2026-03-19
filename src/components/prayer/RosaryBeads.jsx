import { useState, useEffect } from 'react'
import pack from '../../data/undoer_pack.json'

const hailMaryText = pack.texts.rosaryIntro.hailMary.body

export default function RosaryBeads({ count = 10, onComplete, blockId }) {
  const [filled, setFilled] = useState(0)

  useEffect(() => { setFilled(0) }, [blockId])

  function handleTap() {
    if (filled >= count) return
    const next = filled + 1
    setFilled(next)
    if (next === count) setTimeout(() => onComplete?.(), 900)
  }

  const isDone = filled >= count

  return (
    <div data-rosary className="select-none h-full" onClick={handleTap}>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-loose whitespace-pre-line mb-6">
        {hailMaryText}
      </p>

      {/* 묵주알 */}
      <div className="flex items-center justify-center gap-2 py-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={[
              'w-6 h-6 shrink-0 rounded-full border transition-all duration-200',
              i < filled
                ? 'bg-gray-800 dark:bg-gray-100 border-gray-800 dark:border-gray-100 scale-90'
                : 'bg-transparent border-gray-300 dark:border-gray-600',
            ].join(' ')}
          />
        ))}
      </div>

      {/* 카운트 + 안내 — 두 줄 */}
      <div className="text-center mt-2 space-y-0.5">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {filled} / {count}
        </p>
        {!isDone && (
          <p className="text-[10px] text-gray-300 dark:text-gray-600 tracking-widest">
            화면을 탭하세요
          </p>
        )}
      </div>
    </div>
  )
}
