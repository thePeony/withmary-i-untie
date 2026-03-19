import { useEffect, useState } from 'react'

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState('in') // 'in' | 'hold' | 'out'

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('out'), 2200)
    const doneTimer = setTimeout(() => onDone?.(), 3000)
    return () => {
      clearTimeout(holdTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      className={[
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'bg-white dark:bg-gray-950',
        'transition-opacity duration-700 ease-in-out',
        phase === 'in'  ? 'opacity-0 animate-fadein' : '',
        phase === 'hold'? 'opacity-100' : '',
        phase === 'out' ? 'opacity-0' : '',
      ].join(' ')}
    >
      <p className="text-[#8b6f62] dark:text-[#c4a08a] text-sm tracking-[0.3em] font-light">
        잠시 고요히 머뭅니다.
      </p>
    </div>
  )
}
