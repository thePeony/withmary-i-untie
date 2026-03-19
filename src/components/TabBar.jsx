const TABS = [
  {
    id: 'prayer',
    label: '기도',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 3C10 6 7 8 7 12a5 5 0 0010 0c0-4-3-6-5-9z" />
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 17v4M9 21h6" />
      </svg>
    ),
  },
  {
    id: 'mary',
    label: '성모님',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <circle cx="12" cy="8" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6 21v-1a6 6 0 0112 0v1" />
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 11c-3 2-4 5-4 7" />
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 11c3 2 4 5 4 7" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: '설정·기록',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path strokeLinecap="round" d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
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
                'flex-1 flex flex-col items-center gap-1 py-2',
                'transition-colors duration-200',
                active
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-300 dark:text-gray-600',
              ].join(' ')}
            >
              {tab.icon(active)}
              <span className={`text-[10px] tracking-wide ${active ? 'font-medium' : 'font-light'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
