"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useCallback, useState } from "react"
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
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
import { useEditableListing } from "../api/post-ad.queries"
import { useModerationKeywords } from "@/features/content/hooks/content.queries"
import { findModerationMatches } from "@/features/content/lib/moderation-keywords"

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
    province: "",
    district: "",
    label: "",
  },
  contactMethod: "chat",
  phoneNumber: "",
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

interface PostAdWizardProps {
  listingId?: string
}

export function PostAdWizard({ listingId }: PostAdWizardProps) {
  const listing = useEditableListing(listingId)

  if (listingId && listing.isPending) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-10 text-center text-sm text-muted-foreground">
        <LocalizedText id="loadingListingEditor" />
      </div>
    )
  }

  if (listingId && (listing.isError || !listing.data)) {
    return (
      <div role="alert" className="rounded-xl border border-destructive/30 bg-card p-10 text-center">
        <p className="text-sm font-semibold text-destructive"><LocalizedText id="weCouldnTOpenThisListingForEditing" /></p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => listing.refetch()}>
          <LocalizedText id="tryAgain" />
        </Button>
      </div>
    )
  }

  return (
    <PostAdWizardForm
      key={listing.data?.id ?? "new-listing"}
      listingId={listing.data?.id}
      existingIsDraft={listing.data?.isDraft ?? false}
      initialDraft={listing.data?.draft}
    />
  )
}

interface PostAdWizardFormProps {
  listingId?: string
  existingIsDraft: boolean
  initialDraft?: ListingDraft
}

function PostAdWizardForm({ listingId, existingIsDraft, initialDraft }: PostAdWizardFormProps) {
  const tGenerated = useTranslations("generated")
  const tPostAd = useTranslations("ui.postAd")
  const router = useRouter()
  const [initialData] = useState(() =>
    initialDraft
      ? {
          draft: initialDraft,
          step: 2 as PostAdStep,
          done: new Set<PostAdStep>([1, 2, 3, 4, 5]),
        }
      : getInitialDraft()
  )
  const [currentStep, setCurrentStep] = useState<PostAdStep>(initialData.step)
  const [completedSteps, setCompletedSteps] = useState<Set<PostAdStep>>(initialData.done)
  const [draft, setDraft] = useState<ListingDraft>(initialData.draft)
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({})
  const [photoSessionKey, setPhotoSessionKey] = useState(0)
  const moderationKeywords = useModerationKeywords()
  const moderationMatches = findModerationMatches(
    { title: draft.title, description: draft.description },
    moderationKeywords.data ?? [],
  )

  const updateDraft = useCallback((updates: Partial<ListingDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }))
    setStepErrors({})
  }, [])

  const handlePhotosChange = useCallback((photos: ListingDraft["photos"]) => {
    updateDraft({ photos })
  }, [updateDraft])

  const validateCurrentStep = (): boolean => {
    setStepErrors({})

    if (currentStep === 1) {
      const res = categoryStepSchema.safeParse({
        categoryId: draft.categoryId,
        categorySlug: draft.categorySlug,
        categoryPath: draft.categoryPath,
      })
      if (!res.success) {
        setStepErrors({ category: res.error.issues[0]?.message || tPostAd("categoryRequired") })
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
    if (listingId) {
      router.replace("/post-ad")
      return
    }
    setDraft(INITIAL_DRAFT)
    setPhotoSessionKey((key) => key + 1)
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
                  moderationMatches={moderationMatches}
                />
              )}

              <div className={currentStep === 3 ? "block" : "hidden"}>
                <PhotosStep
                  key={photoSessionKey}
                  photos={draft.photos}
                  onChange={handlePhotosChange}
                  error={stepErrors.photos}
                />
              </div>

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
                  listingId={listingId}
                  existingIsDraft={existingIsDraft}
                  onEditStep={handleStepClick}
                  onReset={handleReset}
                  moderationMatches={moderationMatches}
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
                    <span><LocalizedText id="back" /></span>
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-10 px-6 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs sm:text-sm rounded-lg shadow-sm gap-1.5"
                  >
                    <span>{currentStep === 5 ? tGenerated("reviewPublish") : tGenerated("continue")}</span>
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
              <span><LocalizedText id="back" /></span>
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs rounded-lg shadow-sm"
            >
              <span>{currentStep === 5 ? tGenerated("reviewPublish") : tGenerated("continue")}</span>
              <ArrowRight size={16} weight="bold" className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
