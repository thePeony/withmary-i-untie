import { useRef, useEffect } from 'react'
import PrayerBlock from './PrayerBlock'

export default function FlowScreen({ blocks, currentIndex, onAdvance }) {
  const containerRef = useRef(null)

  // 현재 블록으로 자동 스크롤
  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current.querySelector(`[data-block-index="${currentIndex}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentIndex])

  // 섹션이 바뀌는 지점에 헤더 표시
  function getSectionAt(index) {
    if (index === 0) return blocks[0]?.section
    if (blocks[index]?.section !== blocks[index - 1]?.section) {
      return blocks[index]?.section
    }
    return null
  }

  return (
    <div ref={containerRef} className="px-6 pt-8">
      {blocks.map((block, index) => {
        const sectionLabel = getSectionAt(index)
        const isActive = index === currentIndex
        const isPast = index < currentIndex

        return (
          <div key={block.id} data-block-index={index}>
            {/* 섹션 구분 헤더 */}
            {sectionLabel && (
              <p className="text-[10px] tracking-[0.3em] text-gray-300 dark:text-gray-600 uppercase mt-8 mb-2">
                {sectionLabel}
              </p>
            )}

            {/* 지나간 블록은 흐리게 */}
            <div
              className={[
                'transition-opacity duration-500',
                isPast ? 'opacity-30' : 'opacity-100',
              ].join(' ')}
            >
              <PrayerBlock
                block={block}
                onBeadsComplete={() => {
                  // 묵주알 완료 → 즉시 다음으로
                  if (isActive) onAdvance()
                }}
              />
            </div>

            {/* 현재 블록 다음으로 탭 영역 (rosary 타입은 RosaryBeads 자체가 처리) */}
            {isActive && block.type !== 'rosary' && (
              <button
                onClick={onAdvance}
                className="w-full py-5 text-center text-xs text-gray-300 dark:text-gray-600 tracking-widest active:opacity-50 transition-opacity"
              >
                탭하여 계속
              </button>
            )}
          </div>
        )
      })}

      {/* 기도 완료 */}
      {currentIndex >= blocks.length && (
        <div className="flex flex-col items-center py-20 gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500 tracking-widest">
            기도가 완료되었습니다.
          </p>
        </div>
      )}

      <div className="h-32" />
    </div>
  )
}
