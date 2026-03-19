import { useState } from 'react'
import pack from '../data/undoer_pack.json'

const { categories } = pack.aboutUndoerTab

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
        <p className="text-[10px] tracking-[0.3em] text-gray-300 dark:text-gray-600 uppercase mb-1">
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
          const hasContent = cat.body && cat.body.trim().length > 0

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
                  <span className={`text-gray-300 dark:text-gray-600 transition-transform duration-300 text-xs ${isOpen ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                )}
              </button>

              {isOpen && hasContent && (
                <div className="pb-6 text-sm text-gray-600 dark:text-gray-300 leading-loose whitespace-pre-line">
                  {cat.body}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
