import { useState, useEffect, useCallback } from 'react'
import PrayerCard from './PrayerCard'

export default function FlowScreen({ blocks, currentIndex, onAdvance }) {
  const [visible, setVisible] = useState(true)

  // 블록 바뀔 때 페이드 전환
  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 180)
    return () => clearTimeout(t)
  }, [currentIndex])

  const block = blocks[currentIndex]
  const isComplete = currentIndex >= blocks.length

  if (isComplete) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-950 pb-16">
        <p className="text-sm text-gray-400 dark:text-gray-500 tracking-widest">
          기도가 완료되었습니다.
        </p>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 pb-16 bg-white dark:bg-gray-950"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.18s ease-in-out',
      }}
    >
      {/* 섹션 라벨 */}
      <div className="px-6 pt-10 pb-2">
        <p className="text-[10px] tracking-[0.3em] text-gray-300 dark:text-gray-600 uppercase">
          {block.section}
        </p>
      </div>

      {/* 카드 본문 — 긴 텍스트는 내부 스크롤 */}
      <PrayerCard
        block={block}
        onTap={block.type !== 'rosary' ? onAdvance : undefined}
        onBeadsComplete={onAdvance}
      />

      {/* 진행 표시 */}
      <div className="absolute bottom-20 left-0 right-0 px-6">
        <div className="h-px bg-gray-100 dark:bg-gray-800 w-full">
          <div
            className="h-px bg-gray-300 dark:bg-gray-600 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / blocks.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
