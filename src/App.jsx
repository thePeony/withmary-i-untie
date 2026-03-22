import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import TabBar from './components/TabBar'
import PrayerPage from './pages/PrayerPage'
import MaryPage from './pages/MaryPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('prayer')

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      {!loading && (
        <>
          <main className="max-w-lg mx-auto">
            {/* 세 탭 모두 항상 마운트 유지 — 이벤트 리스너가 끊기지 않도록 */}
            <div style={{ display: activeTab === 'prayer' ? 'block' : 'none' }}><PrayerPage /></div>
            <div style={{ display: activeTab === 'mary' ? 'block' : 'none' }}><MaryPage /></div>
            <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}><SettingsPage /></div>
          </main>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  )
}
