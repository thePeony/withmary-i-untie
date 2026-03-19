const TABS = [
  { id: 'prayer',   label: '기도' },
  { id: 'mary',     label: '매듭을 푸시는 성모님' },
  { id: 'settings', label: '기록' },
]

const SEP = (
  <span className="h-4 w-px bg-gray-200 dark:bg-gray-600 shrink-0 self-center" />
)

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700">
      <div className="flex max-w-lg mx-auto items-stretch">

        {/* 기도 */}
        <button
          onClick={() => onTabChange('prayer')}
          className={[
            'flex-1 flex items-center justify-center py-3 transition-colors duration-200',
            activeTab === 'prayer'
              ? 'text-gray-800 dark:text-gray-100'
              : 'text-gray-400 dark:text-gray-500',
          ].join(' ')}
        >
          <span className={`text-xs tracking-wide whitespace-nowrap ${activeTab === 'prayer' ? 'font-medium' : 'font-light'}`}>
            기도
          </span>
        </button>

        {SEP}

        {/* 매듭을 푸시는 성모님 — 중앙, 더 넓게 */}
        <button
          onClick={() => onTabChange('mary')}
          className={[
            'flex-[2] flex items-center justify-center py-3 transition-colors duration-200',
            activeTab === 'mary'
              ? 'text-gray-800 dark:text-gray-100'
              : 'text-gray-400 dark:text-gray-500',
          ].join(' ')}
        >
          <span className={`text-xs tracking-wide whitespace-nowrap ${activeTab === 'mary' ? 'font-medium' : 'font-light'}`}>
            매듭을 푸시는 성모님
          </span>
        </button>

        {SEP}

        {/* 기록 */}
        <button
          onClick={() => onTabChange('settings')}
          className={[
            'flex-1 flex items-center justify-center py-3 transition-colors duration-200',
            activeTab === 'settings'
              ? 'text-gray-800 dark:text-gray-100'
              : 'text-gray-400 dark:text-gray-500',
          ].join(' ')}
        >
          <span className={`text-xs tracking-wide whitespace-nowrap ${activeTab === 'settings' ? 'font-medium' : 'font-light'}`}>
            기록
          </span>
        </button>

      </div>
    </nav>
  )
}
