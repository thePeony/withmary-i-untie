/**
 * Renders prayer body text, applying underline styling to the designated phrase.
 */
export default function PrayerText({ body, underline }) {
  if (!underline || !body.includes(underline)) {
    return (
      <>
        {body.split('\n').map((line, i) => (
          <p key={i} className="prayer-line">
            {line || '\u00A0'}
          </p>
        ))}
      </>
    )
  }

  const parts = body.split(underline)
  const lines = []
  parts.forEach((part, idx) => {
    part.split('\n').forEach((line, li) => {
      lines.push(<p key={`p-${idx}-${li}`} className="prayer-line">{line || '\u00A0'}</p>)
    })
    if (idx < parts.length - 1) {
      lines.push(
        <p key={`u-${idx}`} className="prayer-line">
          <u className="prayer-underline">{underline}</u>
        </p>
      )
    }
  })

  return <>{lines}</>
}
