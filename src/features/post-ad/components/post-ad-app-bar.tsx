"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { X } from "@phosphor-icons/react"
import type { PostAdStep } from "../types"
import { POST_AD_STEPS } from "./post-ad-progress"

interface PostAdAppBarProps {
  title: string
  /** Omit on gate/loading screens: the bar then shows only the title. */
  step?: PostAdStep
}

/**
 * Phone-only top bar for the post-ad flow, like a native sheet: close on the left, title and
 * "Step 2 of 6 · Details" in the middle, a hairline progress bar along the bottom edge.
 */
export function PostAdAppBar({ title, step }: PostAdAppBarProps) {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const total = POST_AD_STEPS.length
  const stepData = step ? POST_AD_STEPS.find((s) => s.step === step) : undefined
  const progress = step ? Math.round((step / total) * 100) : 0

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/95 backdrop-blur-md md:hidden">
      <div className="flex h-14 items-center gap-2 px-2">
        <Link
          href="/"
          aria-label={tGenerated("exit")}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted active:scale-95"
        >
          <X size={20} weight="bold" />
        </Link>
        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate text-[15px] font-bold leading-tight text-foreground">{title}</h1>
          {stepData && (
            <p className="truncate text-2xs font-medium text-muted-foreground">
              {tDynamic("stepOf", { step: stepData.step, total })} · {tGenerated(stepData.titleKey)}
            </p>
          )}
        </div>
        <span className="size-10 shrink-0" aria-hidden="true" />
      </div>
      {step && (
        <div
          className="h-0.5 w-full bg-muted"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step}
          aria-label={tDynamic("stepOf", { step, total })}
        >
          <div className="h-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
      )}
    </header>
  )
}
