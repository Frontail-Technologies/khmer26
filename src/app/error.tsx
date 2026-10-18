"use client"

import { useTranslations } from "next-intl"
import { Warning } from "@phosphor-icons/react"
import { Container } from "@/components/layout/Container"
import { ErrorState } from "@/components/shared/ErrorState"

/**
 * Last-resort boundary for any route that throws while rendering. Network/API failures inside a
 * page are handled by that page's own error state; this only catches unexpected crashes.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations()

  return (
    <Container className="py-10">
      <ErrorState
        icon={<Warning size={28} weight="bold" />}
        title={t("errorPage.title")}
        description={
          error.digest
            ? t("errorPage.descriptionWithRef", { ref: error.digest })
            : t("errorPage.description")
        }
        action={{ label: t("common.tryAgain"), onClick: reset }}
      />
    </Container>
  )
}
