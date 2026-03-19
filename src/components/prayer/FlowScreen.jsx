import { useRef, useEffect } from 'react'
import PrayerBlock from './PrayerBlock'

export default function FlowScreen({ blocks, currentIndex, onAdvance }) {
  const blockRefs = useRef({})

  // 새 블록이 나타날 때 해당 블록 상단으로 부드럽게 스크롤
  useEffect(() => {
    const el = blockRefs.current[currentIndex]
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }, [currentIndex])

  const visibleBlocks = blocks.slice(0, currentIndex + 1)

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
            ref={(el) => { blockRefs.current[index] = el }}
            className="animate-block-in"
          >
            {sectionLabel && (
              <p className="text-[10px] tracking-[0.3em] text-gray-300 dark:text-gray-600 uppercase mt-10 mb-2 first:mt-0">
                {sectionLabel}
              </p>
            )}

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

      {currentIndex >= blocks.length && (
        <div className="flex flex-col items-center py-20 gap-3 animate-block-in">
          <p className="text-sm text-gray-400 dark:text-gray-500 tracking-widest">
            기도가 완료되었습니다.
          </p>
        </div>
      )}

      <div className="h-40" />
    </div>
  )
}
