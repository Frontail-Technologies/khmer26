"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import Image from "next/image"
import {
  CaretLeft,
  CaretRight,
  ArrowsOutSimple,
  Images,
  ImageSquare,
  X,
} from "@phosphor-icons/react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { SNAP_TRACK_CLASS, useSnapCarousel } from "@/hooks/use-snap-carousel"
import type { GalleryImage } from "@/features/listings/lib/listing-detail-format"

interface ListingGalleryProps {
  images: GalleryImage[]
  title: string
  /** Mobile overlay (Back / Save / Share), rendered over the main image. */
  mobileControls?: ReactNode
}

export function ListingGallery({ images, title, mobileControls }: ListingGalleryProps) {
  const tGenerated = useTranslations("generated")
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)
  const fullscreenStripRef = useRef<HTMLDivElement>(null)
  const count = images.length
  const { trackRef, onScroll, onPointerDown, goTo } = useSnapCarousel(activeIndex, setActiveIndex, count)

  // Keep the active thumbnail in view (scrolls the strip only, never the page).
  useEffect(() => {
    for (const strip of [stripRef.current, fullscreenStripRef.current]) {
      const thumb = strip?.children[activeIndex] as HTMLElement | undefined
      if (!strip || !thumb) continue
      const left = thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2
      strip.scrollTo?.({ left: Math.max(0, left), behavior: "smooth" })
    }
  }, [activeIndex, isFullscreen])

  const handlePrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex])
  const handleNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex])

  return (
    <div>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={`${title} photos`}
        tabIndex={images.length > 1 ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault()
            handlePrev()
          } else if (e.key === "ArrowRight") {
            e.preventDefault()
            handleNext()
          } else if (e.key === "Enter" && images.length > 0) {
            setIsFullscreen(true)
          }
        }}
        onClick={() => images.length > 0 && setIsFullscreen(true)}
        className={cn("relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden bg-muted select-none group shadow-2xs focus-visible:outline-2 focus-visible:outline-primary", images.length > 0 && "cursor-zoom-in")}
      >
        {count > 0 ? (
          <div ref={trackRef} onScroll={onScroll} onPointerDown={onPointerDown} className={cn(SNAP_TRACK_CLASS, "absolute inset-0")}>
            {images.map((img, idx) => (
              <div key={img.id || idx} className="relative h-full w-full shrink-0 snap-center snap-always overflow-hidden" aria-hidden={idx !== activeIndex}>
                <Image
                  src={img.url}
                  alt={img.alt || title}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? undefined : isNear(idx, activeIndex, count) ? "eager" : "lazy"}
                  draggable={false}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 850px"
                  className="object-cover transition-transform duration-300 group-hover:scale-102"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/60">
            <ImageSquare size={56} weight="light" aria-hidden="true" />
            <span className="text-xs font-medium"><LocalizedText id="noPhotosAvailable" /></span>
          </div>
        )}

        {mobileControls}

        {images.length > 0 && (
          <div className="absolute bottom-2 left-2 sm:bottom-auto sm:top-3 sm:left-3 z-10 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-foreground shadow-xs pointer-events-none">
            <Images size={14} weight="bold" />
            <span>
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsFullscreen(true)
            }}
            aria-label={tGenerated("viewFullscreenPhoto")}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-md shadow-xs hover:bg-background transition-transform active:scale-95 cursor-pointer"
          >
            <ArrowsOutSimple size={16} weight="bold" />
          </button>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              aria-label={tGenerated("previousPhoto")}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-md shadow-md transition-all hover:bg-background hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <CaretLeft size={20} weight="bold" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              aria-label={tGenerated("nextPhoto")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-md shadow-md transition-all hover:bg-background hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div ref={stripRef} className="relative flex items-center gap-0.5 sm:gap-1.5 overflow-x-auto border-t border-border/60 bg-card px-0 py-0.5 sm:px-3 sm:py-2 scrollbar-thin snap-x snap-mandatory scroll-smooth">
          {images.map((img, idx) => {
            const isSelected = idx === activeIndex
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Select photo ${idx + 1}`}
                aria-pressed={isSelected}
                className={cn(
                  "relative h-[4.25rem] w-[31%] sm:h-14 sm:w-[4.5rem] shrink-0 overflow-hidden rounded-none sm:rounded-sm border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary snap-start scroll-mx-1",
                  isSelected
                    ? "border-primary ring-2 ring-primary/60 shadow-xs scale-102"
                    : "border-border/80 opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${title} photo ${idx + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      )}

      <DialogPrimitive.Root open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md" />
          <DialogPrimitive.Popup
            data-slot="gallery-fullscreen-popup"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault()
                handlePrev()
              } else if (e.key === "ArrowRight") {
                e.preventDefault()
                handleNext()
              }
            }}
            className="fixed inset-0 z-50 flex flex-col justify-between w-screen h-dvh bg-black/95 text-white p-3 sm:p-6 select-none overflow-hidden outline-none"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs sm:text-sm font-bold text-white/80 shrink-0">
                  {activeIndex + 1} / {images.length}
                </span>
                <span className="text-xs sm:text-sm font-medium text-white truncate max-w-50 sm:max-w-md md:max-w-xl">
                  {title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                aria-label={tGenerated("closeFullscreenGallery")}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="relative flex-1 w-full my-2 flex items-center justify-center min-h-0">
              <div className="relative w-full h-full max-h-[82vh]">
                <FullscreenTrack images={images} title={title} index={activeIndex} onIndexChange={setActiveIndex} />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label={tGenerated("previousPhotoInFullscreen")}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer z-20"
                  >
                    <CaretLeft size={28} weight="bold" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={tGenerated("nextPhotoInFullscreen")}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer z-20"
                  >
                    <CaretRight size={28} weight="bold" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div ref={fullscreenStripRef} className="relative flex items-center justify-center gap-2 overflow-x-auto py-2 border-t border-white/10 scrollbar-none">
                {images.map((img, idx) => {
                  const isSelected = idx === activeIndex
                  return (
                    <button
                      key={`modal-${img.id || idx}`}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Go to photo ${idx + 1}`}
                      className={cn(
                        "relative h-14 w-20 sm:h-16 sm:w-24 shrink-0 overflow-hidden rounded-md border transition-all cursor-pointer",
                        isSelected
                          ? "border-primary ring-2 ring-primary"
                          : "border-white/20 opacity-50 hover:opacity-90"
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || `${title} thumbnail ${idx + 1}`}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}

/** The active photo and its neighbours (wrapping) load eagerly so the next swipe never waits. */
function isNear(idx: number, active: number, count: number) {
  const distance = Math.abs(idx - active)
  return distance <= 1 || distance === count - 1
}

/** Mounted only while the fullscreen viewer is open, so it starts on the photo that was tapped. */
function FullscreenTrack({
  images,
  title,
  index,
  onIndexChange,
}: {
  images: GalleryImage[]
  title: string
  index: number
  onIndexChange: (index: number) => void
}) {
  const { trackRef, onScroll, onPointerDown } = useSnapCarousel(index, onIndexChange, images.length)
  return (
    <div ref={trackRef} onScroll={onScroll} onPointerDown={onPointerDown} className={SNAP_TRACK_CLASS}>
      {images.map((img, idx) => (
        <div key={`fs-${img.id || idx}`} className="relative h-full w-full shrink-0 snap-center snap-always" aria-hidden={idx !== index}>
          <Image
            src={img.url}
            alt={img.alt || title}
            fill
            loading={isNear(idx, index, images.length) ? "eager" : "lazy"}
            draggable={false}
            sizes="100vw"
            className="object-contain"
          />
        </div>
      ))}
    </div>
  )
}
