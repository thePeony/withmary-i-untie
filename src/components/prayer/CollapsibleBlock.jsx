import { useState } from 'react'

export default function CollapsibleBlock({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`collapsible ${open ? 'collapsible-open' : ''}`}>
      <button
        className="collapsible-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="collapsible-title">{title}</span>
        <span className="collapsible-arrow" aria-hidden="true">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && <div className="collapsible-content">{children}</div>}
    </div>
  )
}
