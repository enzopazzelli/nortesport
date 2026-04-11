// Parses a description string and renders paragraphs + bullet lists.
// Lines starting with "-", "*" or "•" become list items.
// Supports real newlines (Alt+Enter in Sheets) and literal "\n".

export default function FormattedDescription({ text, className = '' }) {
  if (!text) return null

  const normalized = String(text).replace(/\\n/g, '\n')
  const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean)

  const blocks = []
  let currentList = null

  lines.forEach((line) => {
    const isBullet = /^[-*•]\s*/.test(line)
    if (isBullet) {
      const content = line.replace(/^[-*•]\s*/, '')
      if (!currentList) {
        currentList = { type: 'list', items: [] }
        blocks.push(currentList)
      }
      currentList.items.push(content)
    } else {
      currentList = null
      blocks.push({ type: 'paragraph', content: line })
    }
  })

  return (
    <div className={`space-y-2 ${className}`}>
      {blocks.map((block, i) => {
        if (block.type === 'list') {
          return (
            <ul key={i} className="list-disc list-outside pl-5 space-y-1">
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="leading-relaxed">
            {block.content}
          </p>
        )
      })}
    </div>
  )
}
