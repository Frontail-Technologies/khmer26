export type TextPart = { type: "text"; value: string } | { type: "link"; value: string; href: string }

const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>"']+/gi
const TRAILING_PUNCTUATION = /[.,;:!?)\]}]+$/

/**
 * Splits plain text into text and link parts. Only http(s) and bare "www." addresses become
 * links, so a pasted "javascript:" or "data:" string stays inert text.
 */
export function splitLinks(text: string): TextPart[] {
  const parts: TextPart[] = []
  let cursor = 0

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0
    const raw = match[0]
    const url = raw.replace(TRAILING_PUNCTUATION, "")
    if (!/^(?:https?:\/\/|www\.)[^\s]+\.[^\s]+/i.test(url)) continue

    if (start > cursor) parts.push({ type: "text", value: text.slice(cursor, start) })
    parts.push({ type: "link", value: url, href: /^www\./i.test(url) ? `https://${url}` : url })
    cursor = start + url.length
  }

  if (cursor < text.length) parts.push({ type: "text", value: text.slice(cursor) })
  return parts
}
