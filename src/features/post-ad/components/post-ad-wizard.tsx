"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PostAdProgress } from "./post-ad-progress"
import { ListingPreviewCard } from "./listing-preview-card"
import { CategoryStep } from "./steps/category-step"
import { DetailsStep } from "./steps/details-step"
import { PhotosStep } from "./steps/photos-step"
import { PriceLocationStep } from "./steps/price-location-step"
import { ContactStep } from "./steps/contact-step"
import { PreviewStep } from "./steps/preview-step"
import {
  categoryStepSchema,
  detailsStepSchema,
  photosStepSchema,
  priceLocationStepSchema,
  contactStepSchema,
} from "../schemas/post-ad-schemas"
import type { ListingDraft, PostAdStep } from "../types"

const INITIAL_DRAFT: ListingDraft = {
  categoryId: "",
  categorySlug: "",
  categoryPath: [],
  title: "",
  condition: "like_new",
  description: "",
  attributes: {},
  photos: [],
  price: "",
  currency: "USD",
  negotiable: true,
  location: {
    province: "Phnom Penh",
    district: "Chamkarmon",
    label: "Chamkarmon, Phnom Penh",
  },
  contactMethod: "chat",
  phoneNumber: "+855 12 345 678",
  hidePhoneUntilClick: false,
}

function getInitialDraft(): { draft: ListingDraft; step: PostAdStep; done: Set<PostAdStep> } {
  if (typeof window === "undefined") {
    return { draft: INITIAL_DRAFT, step: 1, done: new Set<PostAdStep>() }
  }

  try {
    const saved = localStorage.getItem("khmer26_post_ad_draft")
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed && typeof parsed === "object") {
        const fullDraft: ListingDraft = { ...INITIAL_DRAFT, ...parsed }
        const done = new Set<PostAdStep>()
        let step: PostAdStep = 1
        if (parsed.categoryId) done.add(1)
        if (parsed.title) done.add(2)
        if (parsed.photos?.length > 0) done.add(3)
        if (parsed.price !== "") done.add(4)

        if (parsed.categoryId && !parsed.title) step = 2
        else if (parsed.title && (!parsed.photos || parsed.photos.length === 0)) step = 3
        else if (parsed.photos?.length > 0 && parsed.price === "") step = 4
        else if (parsed.price !== "") step = 5

        return { draft: fullDraft, step, done }
      }
    }
  } catch {
  }

  return { draft: INITIAL_DRAFT, step: 1, done: new Set<PostAdStep>() }
}

export function PostAdWizard() {
  const [initialData] = useState(getInitialDraft)
  const [currentStep, setCurrentStep] = useState<PostAdStep>(initialData.step)
  const [completedSteps, setCompletedSteps] = useState<Set<PostAdStep>>(initialData.done)
  const [draft, setDraft] = useState<ListingDraft>(initialData.draft)
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({})

  const updateDraft = (updates: Partial<ListingDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }))
    setStepErrors({})
  }

  const validateCurrentStep = (): boolean => {
    setStepErrors({})

    if (currentStep === 1) {
      const res = categoryStepSchema.safeParse({
        categoryId: draft.categoryId,
        categorySlug: draft.categorySlug,
        categoryPath: draft.categoryPath,
      })
      if (!res.success) {
        setStepErrors({ category: res.error.issues[0]?.message || "Category is required" })
        return false
      }
      return true
    }

    if (currentStep === 2) {
      const res = detailsStepSchema.safeParse({
        title: draft.title,
        condition: draft.condition,
        description: draft.description,
        attributes: draft.attributes,
      })
      if (!res.success) {
        const errs: Record<string, string> = {}
        for (const issue of res.error.issues) {
          const key = String(issue.path[0])
          if (!errs[key]) errs[key] = issue.message
        }
        setStepErrors(errs)
        return false
      }
      return true
    }

    if (currentStep === 3) {
      const res = photosStepSchema.safeParse({ photos: draft.photos })
      if (!res.success) {
        setStepErrors({ photos: res.error.issues[0]?.message || "At least 1 photo is required" })
        return false
      }
      return true
    }

    if (currentStep === 4) {
      const res = priceLocationStepSchema.safeParse({
        price: draft.price,
        currency: draft.currency,
        negotiable: draft.negotiable,
        location: draft.location,
      })
      if (!res.success) {
        const errs: Record<string, string> = {}
        for (const issue of res.error.issues) {
          const key = issue.path.join(".")
          if (!errs[key]) errs[key] = issue.message
        }
        setStepErrors(errs)
        return false
      }
      return true
    }

    if (currentStep === 5) {
      const res = contactStepSchema.safeParse({
        contactMethod: draft.contactMethod,
        phoneNumber: draft.phoneNumber,
        hidePhoneUntilClick: draft.hidePhoneUntilClick,
      })
      if (!res.success) {
        const errs: Record<string, string> = {}
        for (const issue of res.error.issues) {
          const key = String(issue.path[0])
          if (!errs[key]) errs[key] = issue.message
        }
        setStepErrors(errs)
        return false
      }
      return true
    }

    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return

    setCompletedSteps((prev) => new Set(prev).add(currentStep))
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as PostAdStep)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as PostAdStep)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleStepClick = (step: PostAdStep) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleReset = () => {
    setDraft(INITIAL_DRAFT)
    setCurrentStep(1)
    setCompletedSteps(new Set())
    setStepErrors({})
  }

  const showPreviewSidebar = currentStep >= 2 && currentStep <= 5

  return (
    <div className="space-y-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-3 lg:col-span-3 md:sticky md:top-20">
          <PostAdProgress
            currentStep={currentStep}
            onStepClick={handleStepClick}
            completedSteps={completedSteps}
          />
        </div>

        <div className={showPreviewSidebar ? "md:col-span-9 lg:col-span-5" : "md:col-span-9 lg:col-span-9"}>
          <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs">
            <CardContent className="p-0">
              {currentStep === 1 && (
                <CategoryStep
                  selectedCategoryId={draft.categoryId}
                  selectedCategorySlug={draft.categorySlug}
                  selectedCategoryPath={draft.categoryPath}
                  onSelect={({ id, slug, path }) => {
                    updateDraft({
                      categoryId: id,
                      categorySlug: slug,
                      categoryPath: path,
                    })
                    setCompletedSteps((prev) => new Set(prev).add(1))
                    setCurrentStep(2)
                  }}
                />
              )}

              {currentStep === 2 && (
                <DetailsStep
                  draft={draft}
                  onChange={updateDraft}
                  errors={stepErrors}
                />
              )}

              {currentStep === 3 && (
                <PhotosStep
                  photos={draft.photos}
                  onChange={(photos) => updateDraft({ photos })}
                  error={stepErrors.photos}
                />
              )}

              {currentStep === 4 && (
                <PriceLocationStep
                  draft={draft}
                  onChange={updateDraft}
                  errors={stepErrors}
                />
              )}

              {currentStep === 5 && (
                <ContactStep
                  draft={draft}
                  onChange={updateDraft}
                  errors={stepErrors}
                />
              )}

              {currentStep === 6 && (
                <PreviewStep
                  draft={draft}
                  onEditStep={handleStepClick}
                  onReset={handleReset}
                />
              )}

              {currentStep < 6 && (
                <div className="hidden md:flex items-center justify-between pt-6 mt-6 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={currentStep === 1}
                    onClick={handleBack}
                    className="h-10 text-xs sm:text-sm font-semibold gap-1.5"
                  >
                    <ArrowLeft size={16} weight="bold" />
                    <span>Back</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-10 px-6 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs sm:text-sm rounded-lg shadow-sm gap-1.5"
                  >
                    <span>{currentStep === 5 ? "Review & Publish" : "Continue"}</span>
                    <ArrowRight size={16} weight="bold" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {showPreviewSidebar && (
          <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-20">
            <ListingPreviewCard draft={draft} />
          </div>
        )}
      </div>

      {currentStep < 6 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur-md p-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-lg md:hidden">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={currentStep === 1}
              onClick={handleBack}
              className="flex-1 h-11 text-xs font-bold rounded-lg border-border"
            >
              <ArrowLeft size={16} weight="bold" className="mr-1" />
              <span>Back</span>
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs rounded-lg shadow-sm"
            >
              <span>{currentStep === 5 ? "Review & Publish" : "Continue"}</span>
              <ArrowRight size={16} weight="bold" className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
