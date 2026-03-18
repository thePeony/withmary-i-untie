import { useEffect, useState } from 'react'
import { useStore } from '../store.jsx'
import { intros } from '../data/content.js'

export default function Intro() {
  const { state, dispatch } = useStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50)
    const t2 = setTimeout(() => {
      dispatch({ type: 'INTRO_DONE' })
    }, 2800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const tab = state.activeTab
  const content = tab === 'mary'
    ? intros.tabs.aboutUndoerTab
    : intros.tabs.prayerTab

  return (
    <div className={`intro-overlay ${visible ? 'intro-visible' : ''}`}>
      <div className="intro-content">
        <p className="intro-subtitle">매듭을 푸는 성모님 9일기도</p>
        <h1 className="intro-title">{content.title}</h1>
        <p className="intro-body">{content.body}</p>
      </div>
    </div>
  )
}
