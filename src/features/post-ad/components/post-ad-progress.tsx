"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import type { PostAdStep } from "../types"
import type { GeneratedMessageKey } from "@/i18n/message-types"

interface PostAdProgressProps {
  currentStep: PostAdStep
  onStepClick?: (step: PostAdStep) => void
  completedSteps: Set<PostAdStep>
}

const STEPS: { step: PostAdStep; titleKey: GeneratedMessageKey; subtitleKey: GeneratedMessageKey }[] = [
  { step: 1, titleKey: "category", subtitleKey: "chooseListingCategory" },
  { step: 2, titleKey: "details", subtitleKey: "titleSpecsDescription" },
  { step: 3, titleKey: "photos", subtitleKey: "uploadClearImages" },
  { step: 4, titleKey: "priceLocation", subtitleKey: "pricingArea" },
  { step: 5, titleKey: "contact", subtitleKey: "buyerContactMode" },
  { step: 6, titleKey: "previewPublish", subtitleKey: "finalReviewPost" },
]

export function PostAdProgress({
  currentStep,
  onStepClick,
  completedSteps,
}: PostAdProgressProps) {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const currentStepData = STEPS.find((s) => s.step === currentStep) || STEPS[0]
  const progressPercent = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)

  return (
    <div>
      <div className="md:hidden mb-4 p-3 rounded-xl border border-border/80 bg-card shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-primary">
            {tDynamic("stepOf", { step: currentStep, total: STEPS.length })}
          </span>
          <span className="font-semibold text-foreground">
            {currentStepData ? tGenerated(currentStepData.titleKey) : null}
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="hidden md:block rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-1">
          <LocalizedText id="listingSteps" />
        </h2>

        <nav aria-label={tGenerated("postAdProgress")} className="space-y-1.5">
          {STEPS.map((s) => {
            const isCompleted = completedSteps.has(s.step)
            const isActive = currentStep === s.step
            const isUpcoming = !isCompleted && !isActive
            const canClick = isCompleted && onStepClick

            return (
              <button
                key={s.step}
                type="button"
                disabled={!canClick && !isActive}
                onClick={() => canClick && onStepClick?.(s.step)}
                className={cn(
                  "w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all",
                  isActive && "bg-primary/10 border border-primary/30 shadow-2xs",
                  isCompleted && !isActive && "hover:bg-muted/60 cursor-pointer",
                  isUpcoming && "opacity-50 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && !isActive && "bg-primary/20 text-primary",
                    isUpcoming && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check size={14} weight="bold" />
                  ) : (
                    <span>{s.step}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-xs font-bold truncate leading-tight",
                      isActive && "text-primary",
                      isCompleted && !isActive && "text-foreground",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {tGenerated(s.titleKey)}
                  </span>
                  <span className="block text-2xs text-muted-foreground truncate leading-tight mt-0.5">
                    {tGenerated(s.subtitleKey)}
                  </span>
                </div>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
