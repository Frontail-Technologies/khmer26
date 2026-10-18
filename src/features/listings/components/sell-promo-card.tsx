"use client"

import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SITE } from "@/lib/constants/site"

export function SellPromoCard() {
  const tDynamic = useTranslations("dynamic")
  return (
    <div className="flex h-full min-h-64 flex-col rounded-xl bg-linear-to-b from-primary to-primary/80 p-4 text-primary-foreground shadow-2xs sm:p-5">
      <h3 className="text-lg font-semibold leading-snug sm:text-xl"><LocalizedText id="wantToSeeYourAdsHere" /></h3>
      <p className="mt-3 text-sm leading-relaxed text-primary-foreground/90">
        {tDynamic("sellPromo", { site: SITE.name })}
      </p>
      <Button
        variant="secondary"
        className="mt-auto h-10 w-full bg-white font-semibold text-neutral-900 hover:bg-white/90 hover:text-neutral-900"
        render={<Link href="/post-ad"><LocalizedText id="sell" /></Link>}
      />
    </div>
  )
}
