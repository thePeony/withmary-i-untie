import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      {!loading && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-300 dark:text-gray-700 text-xs tracking-widest">
            준비 중입니다.
          </p>
        </div>
      )}
    </div>
  )
}
