import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SITE } from "@/lib/constants/site"

export function SellPromoCard() {
  return (
    <div className="flex h-full min-h-64 flex-col rounded-xl bg-linear-to-b from-primary to-primary/80 p-4 text-primary-foreground shadow-2xs sm:p-5">
      <h3 className="text-lg font-semibold leading-snug sm:text-xl">Want to see your ads here?</h3>
      <p className="mt-3 text-sm leading-relaxed text-primary-foreground/90">
        Make some extra cash by selling this in {SITE.name}. Go on, it&apos;s quick and easy.
      </p>
      <Button
        variant="secondary"
        className="mt-auto h-10 w-full bg-white font-semibold text-neutral-900 hover:bg-white/90 hover:text-neutral-900"
        render={<Link href="/post-ad">Sell</Link>}
      />
    </div>
  )
}
