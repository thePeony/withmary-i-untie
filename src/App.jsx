import { useStore } from './store.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import Intro from './components/Intro.jsx'
import TabBar from './components/TabBar.jsx'
import PrayerTab from './components/prayer/PrayerTab.jsx'
import MaryTab from './components/mary/MaryTab.jsx'
import SettingsTab from './components/settings/SettingsTab.jsx'

export default function App() {
  const { state } = useStore()
  const { appPhase, activeTab } = state

  if (appPhase === 'loading') return <LoadingScreen />
  if (appPhase === 'intro') return <Intro />

  return (
    <div className="app">
      <main className="app-main">
        {activeTab === 'prayer' && <PrayerTab />}
        {activeTab === 'mary' && <MaryTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
      <TabBar />
    </div>
  )
}
