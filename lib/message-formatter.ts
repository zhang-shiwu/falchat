type MessagePart = { type: "text"; content: string } | { type: "html"; content: string }

export function formatMessageContent(content: string): MessagePart[] {
  const parts: MessagePart[] = []
  const codeBlockRegex = /```html\n([\s\S]*?)```/g

  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.substring(lastIndex, match.index),
      })
    }

    // Add HTML code block
    parts.push({
      type: "html",
      content: match[1],
    })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      content: content.substring(lastIndex),
    })
  }

  return parts
}
