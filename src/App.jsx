import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import TabBar from './components/TabBar'
import PrayerPage from './pages/PrayerPage'
import MaryPage from './pages/MaryPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('prayer')

  const pages = {
    prayer: <PrayerPage />,
    mary: <MaryPage />,
    settings: <SettingsPage />,
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      {!loading && (
        <>
          <main className="pb-16 max-w-lg mx-auto">
            {pages[activeTab]}
          </main>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  )
}
