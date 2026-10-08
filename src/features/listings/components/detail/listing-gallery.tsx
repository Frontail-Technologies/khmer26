"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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
import type { GalleryImage } from "@/features/listings/lib/listing-detail-format"

interface ListingGalleryProps {
  images: GalleryImage[]
  title: string
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const activeImage = images[activeIndex] ?? null
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 45) {
      handleNext()
    } else if (diff < -45) {
      handlePrev()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "Escape") setIsFullscreen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen, handlePrev, handleNext])

  return (
    <div className="space-y-3">
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn("relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded-2xl border border-border/80 bg-muted select-none group shadow-2xs focus-visible:outline-2 focus-visible:outline-primary", images.length > 0 && "cursor-zoom-in")}
      >
        {activeImage ? (
          <Image
            src={activeImage.url}
            alt={activeImage.alt || title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 850px"
            className="object-cover transition-transform duration-300 group-hover:scale-102"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/60">
            <ImageSquare size={56} weight="light" aria-hidden="true" />
            <span className="text-xs font-medium">No photos available</span>
          </div>
        )}

        {images.length > 0 && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-foreground shadow-xs pointer-events-none">
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
            aria-label="View fullscreen photo"
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
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-md shadow-md transition-all hover:bg-background hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <CaretLeft size={20} weight="bold" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-md shadow-md transition-all hover:bg-background hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1.5 px-0.5 -mx-0.5 scrollbar-thin snap-x snap-mandatory scroll-smooth">
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
                  "relative h-16 w-20 sm:h-20 sm:w-24 shrink-0 overflow-hidden rounded-xl border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary snap-start scroll-mx-1",
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
                aria-label="Close fullscreen gallery"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="relative flex-1 w-full my-2 flex items-center justify-center min-h-0">
              <div className="relative w-full h-full max-h-[82vh] flex items-center justify-center">
                {activeImage && (
                  <Image
                    src={activeImage.url}
                    alt={activeImage.alt || title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain"
                  />
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous photo in fullscreen"
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer z-20"
                  >
                    <CaretLeft size={28} weight="bold" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next photo in fullscreen"
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer z-20"
                  >
                    <CaretRight size={28} weight="bold" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 border-t border-white/10 scrollbar-none">
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
