"use client"

import { useCallback, useEffect, useRef } from "react"

/**
 * Drives a horizontal CSS scroll-snap track (one slide per track width). Swiping is native scrolling,
 * so it tracks the finger like a native app; the active index follows the scroll position, and
 * changing `index` from outside (arrows, thumbnails, another carousel) scrolls the track to it.
 */
export function useSnapCarousel(index: number, onIndexChange: (index: number) => void, count: number) {
  const trackRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(index)
  useEffect(() => {
    indexRef.current = index
  }, [index])

  const indexFromScroll = useCallback(() => {
    const el = trackRef.current
    if (!el || el.clientWidth === 0) return 0
    return Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / el.clientWidth)))
  }, [count])

  // While we animate the track ourselves, intermediate positions must not be reported back as the
  // active index (that would cancel the move, especially with two synced tracks animating at once).
  const targetRef = useRef<number | null>(null)
  const targetTimer = useRef<number | undefined>(undefined)

  const scrollToIndex = useCallback((next: number, behavior: ScrollBehavior = "smooth") => {
    const el = trackRef.current
    if (!el) return
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const smooth = behavior === "smooth" && !reduced
    if (smooth) {
      targetRef.current = next
      window.clearTimeout(targetTimer.current)
      // Safety net if the animation is interrupted and never reaches the target.
      targetTimer.current = window.setTimeout(() => {
        targetRef.current = null
      }, 800)
    }
    el.scrollTo?.({ left: next * el.clientWidth, behavior: smooth ? "smooth" : "auto" })
  }, [])

  useEffect(() => () => window.clearTimeout(targetTimer.current), [])

  const onScroll = useCallback(() => {
    const next = indexFromScroll()
    if (targetRef.current !== null) {
      if (next !== targetRef.current) return
      targetRef.current = null
    }
    if (next !== indexRef.current) onIndexChange(next)
  }, [indexFromScroll, onIndexChange])

  // A finger on the track takes over from any programmatic animation.
  const onPointerDown = useCallback(() => {
    targetRef.current = null
  }, [])

  // Mount (e.g. a fullscreen viewer opening on photo 4): jump straight there, no animation.
  useEffect(() => {
    scrollToIndex(indexRef.current, "auto")
  }, [scrollToIndex])

  // External index changes (arrows, thumbs) move the track; scroll-driven changes are already there.
  useEffect(() => {
    if (indexFromScroll() !== index) scrollToIndex(index)
  }, [index, indexFromScroll, scrollToIndex])

  // Keep the active slide aligned when the track is resized (rotation, window resize).
  useEffect(() => {
    const el = trackRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => scrollToIndex(indexRef.current, "auto"))
    observer.observe(el)
    return () => observer.disconnect()
  }, [scrollToIndex])

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return
      onIndexChange((next + count) % count)
    },
    [count, onIndexChange],
  )

  return { trackRef, onScroll, onPointerDown, goTo, scrollToIndex }
}

/** Track classes: horizontal snap scroller with hidden scrollbar. Each slide needs `w-full shrink-0 snap-center`. */
export const SNAP_TRACK_CLASS =
  "flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
