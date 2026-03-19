import PrayerCard from './PrayerCard'

export default function FlowScreen({ blocks, currentIndex, onAdvance, onBack }) {
  const block = blocks[currentIndex]
  const isComplete = currentIndex >= blocks.length

  if (isComplete) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-950 pb-16">
        <p className="text-sm text-gray-400 dark:text-gray-500 tracking-wide">
          기도가 완료되었습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 pb-16 bg-white dark:bg-gray-950">

      {/* 헤더: 이전 버튼 + 섹션 라벨 + 진행 바 */}
      <div className="px-4 pt-6 pb-0">
        <div className="flex items-center justify-center relative mb-3">
          {currentIndex > 0 && (
            <button
              onClick={onBack}
              className="absolute left-0 text-gray-400 dark:text-gray-500 text-xs tracking-wide py-1 px-1"
            >
              ← 이전
            </button>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wide">
            {block.section}
          </p>
        </div>
        <div className="h-px bg-gray-100 dark:bg-gray-800 w-full">
          <div
            className="h-px bg-gray-400 dark:bg-gray-500 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / blocks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 카드 본문 */}
      <PrayerCard
        key={currentIndex}
        block={block}
        onTap={block.type !== 'rosary' ? onAdvance : undefined}
        onBeadsComplete={onAdvance}
      />
    </div>
  )
}
