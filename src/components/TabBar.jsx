const TABS = [
  { id: 'prayer',   label: '기도' },
  { id: 'mary',     label: '매듭을 푸시는 성모님' },
  { id: 'settings', label: '기록' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="flex max-w-lg mx-auto">
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={[
                'flex-1 flex items-center justify-center py-3',
                'transition-colors duration-200',
                active
                  ? 'text-gray-800 dark:text-gray-100'
                  : 'text-gray-300 dark:text-gray-600',
              ].join(' ')}
            >
              <span className={`text-sm tracking-wide ${active ? 'font-medium' : 'font-light'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
