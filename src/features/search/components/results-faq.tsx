import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: "What should I check before buying a used vehicle in Cambodia?",
    answer:
      "Always inspect the vehicle in person during daylight. Check the engine condition, transmission shifting, tire wear, accident history, and frame alignment. We strongly recommend having a trusted mechanic conduct a pre-purchase inspection.",
  },
  {
    question: "How can I contact a seller directly on Khmer26?",
    answer:
      "Click on any listing card to open the listing details. You can contact the seller directly via in-app instant chat, verified phone call, or Telegram link provided by the seller.",
  },
  {
    question: "Can I negotiate the price listed on the ad?",
    answer:
      "Most private sellers and dealerships in Cambodia welcome reasonable price negotiations. Look for the 'Negotiable' tag next to the price on the listing card.",
  },
  {
    question: "How do I know if a seller is verified?",
    answer:
      "Verified sellers display a blue Shield Check badge on their listing cards and profile. This indicates that their national ID, dealership license, and phone number have been validated by our security team.",
  },
  {
    question: "What documents and road taxes should I verify before purchasing?",
    answer:
      "Verify the original vehicle identification card (Vehicle Identification Card / Carte Grise), current annual road tax stamp (Vignette), technical inspection certificate (Visite Technique), and import tax payment papers (Tax Paper / Import Customs receipt).",
  },
  {
    question: "How do I report a suspicious or duplicate listing?",
    answer:
      "If you notice misleading information, incorrect pricing, or fraudulent behavior, click the 'Report Listing' button located at the bottom of the listing page. Our safety team reviews reports within 2 hours.",
  },
]

interface ResultsFaqProps {
  categoryTitle?: string
  className?: string
}

export function ResultsFaq({ categoryTitle = "Vehicles", className }: ResultsFaqProps) {
  return (
    <section className={cn("mt-12 border-t border-border/60 pt-6 pb-6", className)}>
      <div className="mb-4">
        <h2 className="text-sm sm:text-base font-bold text-foreground">
          Frequently Asked Questions about {categoryTitle}
        </h2>
        <p className="text-[11px] sm:text-xs text-muted-foreground">
          Buyer tips, vehicle inspection, and verified seller guidance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
        {FAQS.map((item, index) => (
          <details
            key={index}
            className="group rounded-lg border border-border/60 bg-card/60 p-3 transition-colors open:border-border open:bg-card select-none"
          >
            <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold text-foreground list-none focus:outline-none">
              <span>{item.question}</span>
              <span className="ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-[10px] font-bold transition-transform duration-200 group-open:rotate-45 group-open:bg-primary/10 group-open:text-primary">
                +
              </span>
            </summary>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground border-t border-border/30 pt-1.5 font-normal">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
