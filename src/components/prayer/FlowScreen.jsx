import { useRef, useEffect } from 'react'
import PrayerBlock from './PrayerBlock'

export default function FlowScreen({ blocks, currentIndex, onAdvance }) {
  const bottomRef = useRef(null)

  // 새 블록 추가될 때마다 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [currentIndex])

  // 완료된 블록 + 현재 블록만 렌더링 (미래 블록은 숨김)
  const visibleBlocks = blocks.slice(0, currentIndex + 1)

  // 섹션 헤더가 필요한 지점
  function getSectionAt(index) {
    if (index === 0) return blocks[0]?.section
    if (blocks[index]?.section !== blocks[index - 1]?.section) {
      return blocks[index]?.section
    }
    return null
  }

  return (
    <div className="px-6 pt-8">
      {visibleBlocks.map((block, index) => {
        const sectionLabel = getSectionAt(index)
        const isActive = index === currentIndex
        const isPast = index < currentIndex

        return (
          <div
            key={block.id}
            className="animate-block-in"
          >
            {/* 섹션 구분 헤더 */}
            {sectionLabel && (
              <p className="text-[10px] tracking-[0.3em] text-gray-300 dark:text-gray-600 uppercase mt-10 mb-2 first:mt-0">
                {sectionLabel}
              </p>
            )}

            {/* 지나간 블록: 흐리게 */}
            <div className={isPast ? 'opacity-25 pointer-events-none' : ''}>
              <PrayerBlock
                block={block}
                isActive={isActive}
                onTap={isActive && block.type !== 'rosary' ? onAdvance : undefined}
                onBeadsComplete={isActive ? onAdvance : undefined}
              />
            </div>
          </div>
        )
      })}

      {/* 기도 완료 */}
      {currentIndex >= blocks.length && (
        <div className="flex flex-col items-center py-20 gap-3 animate-block-in">
          <p className="text-sm text-gray-400 dark:text-gray-500 tracking-widest">
            기도가 완료되었습니다.
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-600">🙏</p>
        </div>
      )}

      {/* 스크롤 앵커 */}
      <div ref={bottomRef} className="h-40" />
    </div>
  )
}
