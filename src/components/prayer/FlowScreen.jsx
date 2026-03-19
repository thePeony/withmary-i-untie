import PrayerCard from './PrayerCard'

export default function FlowScreen({ blocks, currentIndex, onAdvance }) {
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
    <div className="fixed inset-0 pb-16 bg-white dark:bg-gray-950">

      {/* 섹션 라벨 — 본문(text-sm)보다 작게 */}
      <div className="px-6 pt-6 pb-1 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 tracking-[0.3em]">
          {block.section}
        </p>
      </div>

      {/* 카드 본문 — key로 마운트 시 페이드인 */}
      <PrayerCard
        key={currentIndex}
        block={block}
        onTap={block.type !== 'rosary' ? onAdvance : undefined}
        onBeadsComplete={onAdvance}
      />

      {/* 진행 바 */}
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
