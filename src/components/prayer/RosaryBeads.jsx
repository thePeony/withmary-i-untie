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
    if (next === count) setTimeout(() => onComplete?.(), 300)
  }

  return (
    // data-rosary: 카드 빈 공간 탭 시 이 div로 클릭 위임
    <div data-rosary className="select-none h-full" onClick={handleTap}>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-loose whitespace-pre-line mb-6">
        {hailMaryText}
      </p>

      <div className="flex items-center justify-center gap-2 py-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={[
              'w-7 h-7 rounded-full border transition-all duration-200',
              i < filled
                ? 'bg-gray-800 dark:bg-gray-100 border-gray-800 dark:border-gray-100 scale-90'
                : 'bg-transparent border-gray-300 dark:border-gray-600',
            ].join(' ')}
          />
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
        {filled < count ? `화면을 탭하세요 · ${filled} / ${count}` : `✓ ${count}번 완료`}
      </p>
    </div>
  )
}
