"use client"

import { useState } from "react"

/** Web Share API where available; otherwise copies the canonical seller URL. */
export function useShareSeller(sellerId: string, title: string) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = `${window.location.origin}/seller/${sellerId}`
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (insecure context); nothing else to do.
    }
  }

  return { share, copied }
}
