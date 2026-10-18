import { LocalizedText } from "@/components/i18n/localized-text"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { Container } from "@/components/layout/Container"
import type { ContentPage } from "../types"
import { localizePage } from "../lib/localize"
import { PolicySectionNav } from "./policy-section-nav"
import { intlLocaleFor, type Locale } from "@/i18n/config"

function formatUpdatedAt(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocaleFor(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value))
}

export function PolicyPage({ page: storedPage }: { page: ContentPage }) {
  const locale = useLocale() as Locale
  const page = localizePage(storedPage, locale)
  const tDynamic = useTranslations("dynamic")
  return (
    <main className="border-t border-border/70 bg-background">
      <Container className="py-8 sm:py-12 lg:py-16">
        <header className="border-b border-border pb-8">
          <p className="text-xs font-semibold uppercase text-primary">{page.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{page.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {tDynamic("lastUpdated", { date: formatUpdatedAt(page.updatedAt, locale) })}
          </p>
        </header>

        <div className="grid gap-10 pt-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
          <PolicySectionNav title={page.title} sections={page.sections} />

          <article className="min-w-0 space-y-10">
            {page.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{section.title}</h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.items.length > 0 && (
                    <ul className="list-disc space-y-2 pl-6 marker:text-primary">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}

            <footer className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground"><LocalizedText id="questionsAboutThisPolicy" /></p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                <LocalizedText id="contactKhmer26" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </footer>
          </article>
        </div>
      </Container>
    </main>
  )
}
