import type { Locale } from "@/i18n/config"
import { pickText } from "@/lib/i18n/pick-text"
import type { ContentPage, ContentPageSection, PublicSafetyTip } from "../types"

export function localizeTip(tip: Pick<PublicSafetyTip, "tip" | "tipKm">, locale: Locale): string {
  return pickText(tip.tip, tip.tipKm, locale)
}

/**
 * Sections are matched by id, so a partly translated page shows Khmer where it exists and English
 * for the rest, and reordering the English sections never scrambles the translation.
 */
export function localizeSections(
  sections: ContentPageSection[],
  sectionsKm: ContentPageSection[] | null | undefined,
  locale: Locale
): ContentPageSection[] {
  if (locale !== "km" || !sectionsKm?.length) return sections
  const khmerById = new Map(sectionsKm.map((section) => [section.id, section]))
  return sections.map((section) => khmerById.get(section.id) ?? section)
}

export function localizePage(page: ContentPage, locale: Locale): ContentPage {
  return {
    ...page,
    eyebrow: pickText(page.eyebrow, page.eyebrowKm, locale),
    title: pickText(page.title, page.titleKm, locale),
    summary: pickText(page.summary, page.summaryKm, locale),
    sections: localizeSections(page.sections, page.sectionsKm, locale),
  }
}

export { pickText }
