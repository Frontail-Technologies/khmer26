import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/card"
import {
  CheckCircle,
  Prohibit,
  Image,
  Tag,
  ShieldCheck,
  ArrowRight,
  Storefront,
} from "@phosphor-icons/react/dist/ssr"

export const metadata: Metadata = {
  title: "Marketplace Posting Rules",
  description:
    "Guidelines and security standards for posting classified listings on Khmer26.",
}

const ALLOWED_RULES = [
  "Accurate listing title and genuine item description.",
  "Clear, authentic photographs of the actual item taken by the seller.",
  "Realistic market prices listed in USD or KHR (no misleading $0 or $1 prices).",
  "Correct category, brand, and condition attributes selected.",
  "Transparent disclosure of any item flaws, wear, or damages.",
]

const PROHIBITED_ITEMS = [
  "Weapons, firearms, ammunition, and fireworks.",
  "Illegal drugs, narcotics, prescription medicines, and chemical substances.",
  "Counterfeit, forged, replicated, or pirated trademark items.",
  "Stolen property, forged official documents, and fake certificates.",
  "Endangered wildlife, illegal animals, and unregulated ivory products.",
  "Financial fraud, pyramid investment schemes, and deceptive loan ads.",
]

const BEST_PRACTICES = [
  {
    title: "Accurate Pricing",
    description:
      "State the exact selling or rental price. If the price is negotiable, enable the Negotiable tag rather than setting arbitrary placeholders.",
    icon: Tag,
  },
  {
    title: "Original Photos",
    description:
      "Upload high-resolution, unedited photos showing all angles. Avoid screenshots, watermarked images from other websites, or promotional banners.",
    icon: Image,
  },
  {
    title: "One Ad per Unique Item",
    description:
      "Do not create duplicate listings for the same item across multiple categories or provinces. To keep items fresh, use listing boost features.",
    icon: Storefront,
  },
  {
    title: "Safety & In-Person Inspection",
    description:
      "Encourage buyers to inspect vehicles, electronics, and goods in person at public locations in Cambodia before completing payments.",
    icon: ShieldCheck,
  },
]

export default function PostingRulesPage() {
  return (
    <Container>
      <div className="py-6 sm:py-10 max-w-4xl mx-auto space-y-8 pb-16 md:pb-12">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Khmer26 Marketplace Policy
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Listing & Posting Guidelines
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Follow these essential rules to ensure your listings are approved quickly
            and reach trusted buyers across Cambodia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-card shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm sm:text-base">
              <CheckCircle size={20} weight="fill" />
              <span>What You Should Do</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              {ALLOWED_RULES.map((rule) => (
                <li key={rule} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 sm:p-5 rounded-2xl border border-destructive/30 bg-card shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-destructive font-bold text-sm sm:text-base">
              <Prohibit size={20} weight="bold" />
              <span>Prohibited Items & Activities</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              {PROHIBITED_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Core Listing Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {BEST_PRACTICES.map((item) => {
              const Icon = item.icon
              return (
                <Card
                  key={item.title}
                  className="p-4 sm:p-5 rounded-xl border border-border/80 bg-card shadow-2xs space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon size={18} weight="duotone" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>

        <Card className="p-4 sm:p-6 rounded-2xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Ready to post your classified ad?
            </h3>
            <p className="text-xs text-muted-foreground">
              Publishing is fast, free, and visible to verified buyers immediately.
            </p>
          </div>
          <Link
            href="/post-ad"
            className="inline-flex items-center justify-center gap-1.5 h-9 px-4 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          >
            <span>Post an Ad Now</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </Card>
      </div>
    </Container>
  )
}
