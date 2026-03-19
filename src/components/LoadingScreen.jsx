import { useEffect, useState } from 'react'

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState('in') // 'in' | 'hold' | 'out'

  useEffect(() => {
    const showTimer = setTimeout(() => setPhase('hold'), 50)   // 페이드인
    const hideTimer = setTimeout(() => setPhase('out'), 2200)  // 페이드아웃 시작
    const doneTimer = setTimeout(() => onDone?.(), 3000)       // 완전히 사라짐
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
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
        phase === 'hold' ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      <p className="text-[#8b6f62] dark:text-[#c4a08a] text-sm tracking-widest font-light">
        잠시 고요히 머뭅니다.
      </p>
    </div>
  )
}
