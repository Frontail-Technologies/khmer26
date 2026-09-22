"use client"

import { Button } from "@/components/ui/button"
import { SLIDER_SLIDES } from "@/features/home/data/slider-slides"
import { cn } from "@/lib/utils"
import { ArrowRight, CaretLeft, CaretRight } from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState, type TouchEvent } from "react"
import { HeroSearchBar } from "./hero-search-bar"

export function MarketplaceSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const slidesCount = SLIDER_SLIDES.length
  const currentSlide = SLIDER_SLIDES[currentIndex]

  function nextSlide() {
    setCurrentIndex((prev) => (prev + 1) % slidesCount)
  }

  function prevSlide() {
    setCurrentIndex((prev) => (prev - 1 + slidesCount) % slidesCount)
  }

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slidesCount)
    }, 5500)
    return () => clearInterval(timer)
  }, [isPaused, slidesCount])

  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.targetTouches[0].clientX
  }

  function handleTouchMove(e: TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX
  }

  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 50) {
      nextSlide()
    } else if (diff < -50) {
      prevSlide()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <div
      className="my-3 sm:my-4 space-y-2.5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-55 sm:min-h-65 lg:min-h-72.5 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center p-5 sm:p-7 lg:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-accent/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-accent uppercase">
                {currentSlide.badge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-foreground leading-tight">
              {currentSlide.title} <span className="text-primary">{currentSlide.highlight}</span>
            </h1>

            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-lg line-clamp-2 leading-relaxed">
              {currentSlide.description}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Button
                size="sm"
                className="h-9 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-xs"
                render={
                  <Link href={currentSlide.ctaHref} className="flex items-center gap-1.5">
                    <span>{currentSlide.ctaLabel}</span>
                    <ArrowRight size={14} weight="bold" />
                  </Link>
                }
              />
              {currentSlide.secondaryCtaLabel && currentSlide.secondaryCtaHref && (
                <Link
                  href={currentSlide.secondaryCtaHref}
                  className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {currentSlide.secondaryCtaLabel}
                </Link>
              )}
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:flex items-center justify-center p-6 relative">
            <div className="relative w-full max-w-85 aspect-4/3 rounded-xl overflow-hidden border border-border/70 shadow-xs">
              <Image
                src={currentSlide.imageUrl}
                alt={currentSlide.imageAlt}
                fill
                sizes="(max-width: 1200px) 33vw, 340px"
                className="object-cover transition-opacity duration-300"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded-lg bg-background/90 backdrop-blur-md px-3 py-1.5 border border-border/60 shadow-2xs text-xs">
                <span className="font-semibold text-foreground">{currentSlide.statLabel}</span>
                <span className="font-bold text-accent">{currentSlide.statValue}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 z-20">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 hover:bg-background text-foreground border border-border/60 shadow-xs transition-colors"
          >
            <CaretLeft size={14} weight="bold" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-background/80 hover:bg-background text-foreground border border-border/60 shadow-xs transition-colors"
          >
            <CaretRight size={14} weight="bold" />
          </button>
        </div>

        <div className="absolute bottom-3.5 left-5 sm:bottom-4 sm:left-7 flex items-center gap-1.5 z-20">
          {SLIDER_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
            />
          ))}
        </div>
      </div>

      <HeroSearchBar />
    </div>
  )
}
