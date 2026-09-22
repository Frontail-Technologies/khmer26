import Link from "next/link"
import { ShieldCheck, CheckCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent } from "@/components/ui/card"

const SAFETY_TIPS = [
  "Meet the seller in a public, well-lit place",
  "Inspect and test the item carefully before paying",
  "Never send advance deposits or wire transfers to unknown individuals",
  "Report any suspicious or misleading listing immediately",
]

export function ListingSafetyCard() {
  return (
    <Card className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 shadow-xs">
      <CardContent className="p-0 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck size={20} weight="fill" />
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Buy with confidence
          </h3>
        </div>

        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {SAFETY_TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle
                size={14}
                weight="fill"
                className="text-primary shrink-0 mt-0.5"
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        <div className="pt-1 border-t border-primary/10">
          <Link
            href="/safety"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline transition-colors"
          >
            <span>View Safety Tips</span>
            <ArrowRight size={12} weight="bold" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
