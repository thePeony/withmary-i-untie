import { useState } from 'react'

export default function Accordion({ items }) {
  const [openId, setOpenId] = useState(items.find((i) => i.defaultOpen)?.id ?? null)

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id} className={`accordion-item ${isOpen ? 'accordion-open' : ''}`}>
            <button
              className="accordion-header"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              <span className="accordion-title">{item.title}</span>
              <span className="accordion-arrow" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className="accordion-body">
                {item.body
                  ? item.body.split('\n').map((line, i) => (
                      <p key={i} className={line.startsWith('•') || line.match(/^\d+\./) ? 'accordion-list-item' : 'accordion-para'}>
                        {line || '\u00A0'}
                      </p>
                    ))
                  : null}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
