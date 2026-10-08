import Link from "next/link"
import { ShieldCheck, CheckCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent } from "@/components/ui/card"

const SAFETY_TIPS = [
  "Meet in a public, well-lit place",
  "Inspect and test the item before paying",
  "Never send advance deposits to strangers",
  "Report suspicious listings",
]

/** Approved static product copy; there is no public safety-tips endpoint for listings yet. */
export function ListingSafetyCard() {
  return (
    <Card size="sm" className="bg-primary/5 ring-primary/20">
      <CardContent className="pt-(--card-spacing) space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} weight="fill" className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Buy with confidence</h3>
        </div>

        <ul className="space-y-1 text-[11px] text-muted-foreground sm:text-xs">
          {SAFETY_TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-1.5">
              <CheckCircle size={13} weight="fill" className="mt-0.5 shrink-0 text-primary" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/posting-rules"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <span>View Safety Tips</span>
          <ArrowRight size={12} weight="bold" />
        </Link>
      </CardContent>
    </Card>
  )
}
