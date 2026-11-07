"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useCallback, useState } from "react"
import { ArrowLeft, ArrowRight, ShieldCheck } from "@phosphor-icons/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PostAdProgress } from "./post-ad-progress"
import { PostAdAppBar } from "./post-ad-app-bar"
import { Skeleton } from "@/components/ui/skeleton"
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
import { usePostingEligibility } from "@/features/account/profile/api/profile.queries"

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
  /** "Create New Listing" / "Edit Listing", shown in the phone app bar. */
  title: string
}

/** Placeholder shaped like the wizard (progress rail, step card with a tile grid). */
export function WizardSkeleton({ title }: { title: string }) {
  const tGenerated = useTranslations("generated")
  return (
    <div aria-busy="true" aria-label={tGenerated("loading_8f26c6")}>
      <PostAdAppBar title={title} />
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
        <div className="hidden space-y-3 rounded-xl border border-border/80 bg-card p-4 md:col-span-3 md:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-7 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/5" />
                <Skeleton className="h-2.5 w-4/5" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card p-4 md:col-span-9 md:rounded-2xl md:border md:border-border/80 md:p-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-2 h-3.5 w-64 max-w-full" />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PostAdWizard({ listingId, title: pageTitle }: PostAdWizardProps) {
  const eligibility = usePostingEligibility()
  const listing = useEditableListing(listingId)

  if (eligibility.isPending) return <WizardSkeleton title={pageTitle} />

  if (eligibility.isError) {
    return (
      <>
      <PostAdAppBar title={pageTitle} />
      <div role="alert" className="m-4 rounded-lg border border-destructive/30 bg-card p-8 text-center md:m-0">
        <p className="text-sm font-semibold text-destructive">We could not check your posting eligibility.</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => eligibility.refetch()}>
          Try again
        </Button>
      </div>
      </>
    )
  }

  if (!eligibility.data?.canPost) {
    const status = eligibility.data?.status
    const title = status === "pending" || status === "in_review"
      ? "Verification under review"
      : status === "rejected"
        ? "Verification needs attention"
        : status === "profile_required"
          ? "Complete your seller profile"
          : "Verify your identity to post"
    const description = status === "pending" || status === "in_review"
      ? "You can start posting after an administrator approves your verification."
      : "Complete seller verification from your profile before creating a listing."

    const underReview = status === "pending" || status === "in_review"
    const actionLabel = underReview ? "View verification status" : "Open profile verification"

    // Phones: a full-screen state with the action pinned to the bottom, like a native app.
    // From md up: the same content in a centred card.
    return (
      <>
        <PostAdAppBar title={pageTitle} />
        <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col md:min-h-0">
          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-36 pt-10 text-center md:mx-auto md:max-w-xl md:flex-none md:rounded-2xl md:border md:border-border/80 md:bg-card md:p-10 md:shadow-xs">
            <div className="relative flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/10 [animation-duration:2.4s] motion-reduce:hidden" aria-hidden="true" />
              <ShieldCheck size={40} weight="duotone" />
            </div>
            <h2 className="mt-6 text-xl font-extrabold tracking-tight text-foreground">{title}</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
            <Button className="mt-7 hidden h-11 w-full max-w-xs rounded-xl font-bold md:inline-flex" render={<Link href="/account/profile" />}>
              {actionLabel}
            </Button>
          </div>
          <div className="fixed inset-x-0 bottom-0 z-40 space-y-1.5 border-t border-border/70 bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] backdrop-blur-md md:hidden">
            <Button className="h-12 w-full rounded-xl text-sm font-bold" render={<Link href="/account/profile" />}>
              {actionLabel}
            </Button>
            <Button variant="ghost" className="h-10 w-full rounded-xl text-sm font-semibold text-muted-foreground" render={<Link href="/" />}>
              Not now
            </Button>
          </div>
        </div>
      </>
    )
  }

  if (listingId && listing.isPending) return <WizardSkeleton title={pageTitle} />

  if (listingId && (listing.isError || !listing.data)) {
    return (
      <>
      <PostAdAppBar title={pageTitle} />
      <div role="alert" className="m-4 rounded-xl border border-destructive/30 bg-card p-10 text-center md:m-0">
        <p className="text-sm font-semibold text-destructive"><LocalizedText id="weCouldnTOpenThisListingForEditing" /></p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => listing.refetch()}>
          <LocalizedText id="tryAgain" />
        </Button>
      </div>
      </>
    )
  }

  return (
    <PostAdWizardForm
      title={pageTitle}
      key={listing.data?.id ?? "new-listing"}
      listingId={listing.data?.id}
      existingIsDraft={listing.data?.isDraft ?? false}
      initialDraft={listing.data?.draft}
    />
  )
}

interface PostAdWizardFormProps {
  title: string
  listingId?: string
  existingIsDraft: boolean
  initialDraft?: ListingDraft
}

function PostAdWizardForm({ title, listingId, existingIsDraft, initialDraft }: PostAdWizardFormProps) {
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
      <PostAdAppBar title={title} step={currentStep} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="hidden md:block md:col-span-3 lg:col-span-3 md:sticky md:top-20">
          <PostAdProgress
            currentStep={currentStep}
            onStepClick={handleStepClick}
            completedSteps={completedSteps}
          />
        </div>

        <div className={showPreviewSidebar ? "md:col-span-9 lg:col-span-5" : "md:col-span-9 lg:col-span-9"}>
          <Card className="rounded-none border-0 bg-card p-4 shadow-none ring-0 md:rounded-2xl md:border md:border-border/80 md:p-6 md:shadow-xs">
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
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] backdrop-blur-md md:hidden">
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleBack}
                aria-label={tGenerated("back")}
                className="size-12 shrink-0 rounded-xl border-border"
              >
                <ArrowLeft size={18} weight="bold" />
              </Button>
            )}
            <Button
              type="button"
              onClick={handleNext}
              className="h-12 flex-1 gap-1.5 rounded-xl bg-accent text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent/90 active:scale-[0.99]"
            >
              <span>{currentStep === 5 ? tGenerated("reviewPublish") : tGenerated("continue")}</span>
              <ArrowRight size={16} weight="bold" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
