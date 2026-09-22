import Link from "next/link"
import { Plus, ShieldCheck, Sparkle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export function CategoryPostAdCta() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-card to-accent/10 p-6 sm:p-8 md:p-10 shadow-sm">
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
            <Sparkle size={14} weight="fill" />
            <span>Join 50,000+ Active Sellers</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight">
            Have something to sell in Cambodia?
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Post your ad in any category for free in less than 2 minutes. Connect directly with buyers via real-time messaging and verified inquiries.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto shrink-0">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl h-11 px-5 gap-2 shadow-sm"
            render={
              <Link href="/post-ad">
                <Plus size={18} weight="bold" />
                <span>Post Free Ad</span>
              </Link>
            }
          />

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto font-bold rounded-xl h-11 px-5 gap-2 border-border/80 hover:bg-muted"
            render={
              <Link href="/pricing">
                <ShieldCheck size={18} weight="bold" />
                <span>Seller Plans</span>
              </Link>
            }
          />
        </div>
      </div>
    </div>
  )
}
