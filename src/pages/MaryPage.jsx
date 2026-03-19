import { useState } from 'react'
import pack from '../data/undoer_pack.json'

const { categories } = pack.aboutUndoerTab

// <b>, <strong> → 볼드 렌더링
function renderBody(text) {
  if (!text) return null
  return text.split('\n').map((line, i) => {
    if (line === '') return <span key={i} className="block mt-3" />
    const parts = line.split(/(<b>.*?<\/b>|<strong>.*?<\/strong>)/g).map((chunk, j) => {
      if (/^<b>/.test(chunk)) return <strong key={j}>{chunk.replace(/<\/?b>/g, '')}</strong>
      if (/^<strong>/.test(chunk)) return <strong key={j}>{chunk.replace(/<\/?strong>/g, '')}</strong>
      return <span key={j}>{chunk}</span>
    })
    return <span key={i} className="block">{parts}</span>
  })
}

export default function MaryPage() {
  const [openId, setOpenId] = useState(
    categories.find((c) => c.defaultOpen)?.id ?? null
  )

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="min-h-screen pt-8 px-6 pb-20">
      {/* 헤더 */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-gray-400 dark:text-gray-500 uppercase mb-1">
          About
        </p>
        <h1 className="text-lg font-light text-gray-700 dark:text-gray-200">
          매듭을 푸시는 성모님
        </h1>
      </div>

      {/* 아코디언 */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {categories.map((cat) => {
          const isOpen = openId === cat.id
          const isPainting = cat.id === 'painting'
          const hasContent = isPainting || (cat.body && cat.body.trim().length > 0)

          return (
            <div key={cat.id}>
              <button
                onClick={() => hasContent && toggle(cat.id)}
                className={[
                  'w-full flex items-center justify-between py-5 text-left',
                  hasContent ? 'cursor-pointer' : 'cursor-default',
                ].join(' ')}
              >
                <span className={`text-sm ${isOpen ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {cat.title}
                </span>
                {hasContent && (
                  <span className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 text-base leading-none ${isOpen ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                )}
              </button>

              {isOpen && (
                <div className="pb-6">
                  {isPainting && (
                    <img
                      src="/mary.jpg"
                      alt="매듭을 푸시는 성모님 성화"
                      className="w-full rounded-lg object-cover mb-4"
                    />
                  )}
                  {cat.body && cat.body.trim().length > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-loose">
                      {renderBody(cat.body)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
