"use client"

import { Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import type { PostAdStep } from "../types"

interface PostAdProgressProps {
  currentStep: PostAdStep
  onStepClick?: (step: PostAdStep) => void
  completedSteps: Set<PostAdStep>
}

const STEPS: { step: PostAdStep; title: string; subtitle: string }[] = [
  { step: 1, title: "Category", subtitle: "Choose listing category" },
  { step: 2, title: "Details", subtitle: "Title, specs & description" },
  { step: 3, title: "Photos", subtitle: "Upload clear images" },
  { step: 4, title: "Price & Location", subtitle: "Pricing & area" },
  { step: 5, title: "Contact", subtitle: "Buyer contact mode" },
  { step: 6, title: "Preview & Publish", subtitle: "Final review & post" },
]

export function PostAdProgress({
  currentStep,
  onStepClick,
  completedSteps,
}: PostAdProgressProps) {
  const currentStepData = STEPS.find((s) => s.step === currentStep) || STEPS[0]
  const progressPercent = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)

  return (
    <div>
      <div className="md:hidden mb-4 p-3 rounded-xl border border-border/80 bg-card shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-primary">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="font-semibold text-foreground">
            {currentStepData?.title}
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
          Listing Steps
        </h2>

        <nav aria-label="Post ad progress" className="space-y-1.5">
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
                    {s.title}
                  </span>
                  <span className="block text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                    {s.subtitle}
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
