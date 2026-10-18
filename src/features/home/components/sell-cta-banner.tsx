import { LocalizedText } from "@/components/i18n/localized-text"
import { Button } from "@/components/ui/button"
import { ArrowRight, Storefront } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

export function SellCtaBanner() {
  return (
    <section className="my-4 sm:my-6 rounded-xl border border-border/80 bg-card p-3.5 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Storefront size={22} weight="duotone" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            <LocalizedText id="haveSomethingToSell" />
          </h3>
        </div>

        <Button
          size="sm"
          className="w-full sm:w-auto h-9 px-5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-xs shrink-0"
          render={
            <Link href="/post-ad" className="flex items-center justify-center gap-1.5">
              <span><LocalizedText id="postAnAd" /></span>
              <ArrowRight size={15} weight="bold" />
            </Link>
          }
        />
      </div>
    </section>
  )
}
