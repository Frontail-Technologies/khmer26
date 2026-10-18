import { LocalizedText } from "@/components/i18n/localized-text"
import { WarningCircle } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import type { ListingModerationMatch } from "../types"

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function HighlightedModerationText({
  text,
  matches,
  field,
}: {
  text: string
  matches: ListingModerationMatch[]
  field: ListingModerationMatch["field"]
}) {
  const words = [...new Set(matches.filter((match) => match.field === field).map((match) => match.keyword))]
    .sort((a, b) => b.length - a.length)
  if (words.length === 0) return <>{text}</>
  const pattern = new RegExp(`(${words.map(escapeRegExp).join("|")})`, "giu")
  const lookup = new Set(words.map((word) => word.toLocaleLowerCase()))
  return <>{text.split(pattern).map((part, index) => lookup.has(part.toLocaleLowerCase())
    ? <mark key={`${part}-${index}`} className="rounded-sm bg-warning/25 px-0.5 text-inherit">{part}</mark>
    : part)}</>
}

export function ModerationKeywordNotice({ matches }: { matches: ListingModerationMatch[] }) {
  if (matches.length === 0) return null
  const unique = [...new Map(matches.map((match) => [match.keywordId, match])).values()]

  return (
    <div role="status" className="rounded-md border border-warning/35 bg-warning/10 p-3 text-sm">
      <div className="flex items-start gap-2">
        <WarningCircle className="mt-0.5 shrink-0 text-warning" weight="fill" aria-hidden="true" />
        <div className="min-w-0 space-y-2">
          <p className="font-semibold text-foreground"><LocalizedText id="termsThatNeedModeratorReview" /></p>
          <p className="text-xs leading-5 text-muted-foreground">
            <LocalizedText id="youCanStillSubmitThisListingTheseTermsWill" />
          </p>
          <div className="flex flex-wrap gap-1.5">
            {unique.map((match) => (
              <Badge key={match.keywordId} variant="outline" className="border-warning/40 bg-background text-foreground">
                {match.keyword}
              </Badge>
            ))}
          </div>
          {unique.some((match) => match.guidance) && (
            <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              {unique.filter((match) => match.guidance).map((match) => (
                <li key={match.keywordId}>{match.guidance}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
