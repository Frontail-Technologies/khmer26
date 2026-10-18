import type { ListingModerationMatch, ModerationKeyword } from "../types"

export function normalizeModerationText(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/\s+/gu, " ").trim()
}

export function findModerationMatches(
  input: { title: string; description: string },
  rules: ModerationKeyword[],
): ListingModerationMatch[] {
  const fields = [
    ["title", normalizeModerationText(input.title)] as const,
    ["description", normalizeModerationText(input.description)] as const,
  ]

  return rules.flatMap((rule) => {
    const needle = normalizeModerationText(rule.keyword)
    if (!needle) return []
    return fields.flatMap(([field, content]) => content.includes(needle)
      ? [{ ...rule, keywordId: rule.id, field }]
      : [])
  })
}
