import { useState, useEffect } from 'react'
import Accordion from './Accordion.jsx'
import { maryTabContent } from '../../data/maryContent.js'

export default function MaryTab() {
  const [introVisible, setIntroVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setIntroVisible(true), 80)
    const t2 = setTimeout(() => setShowContent(true), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="mary-tab">
      {/* Intro fade */}
      {!showContent && (
        <div className={`mary-intro ${introVisible ? 'mary-intro--visible' : ''}`}>
          <h1 className="mary-intro-title">{maryTabContent.intro.title}</h1>
          <p className="mary-intro-body">{maryTabContent.intro.body}</p>
        </div>
      )}

      {/* Main content */}
      {showContent && (
        <div className="mary-content">
          <h1 className="mary-tab-title">{maryTabContent.title}</h1>
          <Accordion items={maryTabContent.categories} />
        </div>
      )}
    </div>
  )
}
