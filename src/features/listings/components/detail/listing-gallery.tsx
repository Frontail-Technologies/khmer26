"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import {
  CaretLeft,
  CaretRight,
  ArrowsOutSimple,
  Images,
  X,
} from "@phosphor-icons/react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import type { ListingImage } from "@/types"

interface ListingGalleryProps {
  images: ListingImage[]
  title: string
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const activeImage = images[activeIndex] || {
    id: "fallback",
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85",
    alt: title,
    isPrimary: true,
  }

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

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
        onClick={() => setIsFullscreen(true)}
        className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded-xl border border-border/70 bg-muted select-none group cursor-zoom-in"
      >
        <Image
          src={activeImage.url}
          alt={activeImage.alt || title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 850px"
          className="object-cover transition-transform duration-300 group-hover:scale-102"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-md shadow-md transition-all hover:bg-background hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer z-10"
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
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-md shadow-md transition-all hover:bg-background hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer z-10"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </>
        )}

        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-md bg-background/80 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-md shadow-xs">
          <Images size={15} />
          <span>
            {activeIndex + 1} / {images.length}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsFullscreen(true)
          }}
          aria-label="View fullscreen photo"
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-background/80 text-foreground backdrop-blur-md shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowsOutSimple size={16} weight="bold" />
        </button>
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
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
                  "relative h-16 w-20 sm:h-20 sm:w-24 shrink-0 overflow-hidden rounded-lg border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "border-primary ring-2 ring-primary/40 shadow-xs"
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
            className="fixed inset-0 z-50 flex flex-col justify-between w-screen h-screen bg-black/95 text-white p-3 sm:p-6 select-none overflow-hidden outline-none"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white/70 shrink-0">
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
                <Image
                  src={activeImage.url}
                  alt={activeImage.alt || title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
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
