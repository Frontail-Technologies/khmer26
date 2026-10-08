"use client"

import { cn } from "@/lib/utils"
import { Heart } from "@phosphor-icons/react"
import { useState, type MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { useToggleFavorite } from "../hooks/use-toggle-favorite"

interface FavoriteButtonProps {
  listingId: string
  initialFavorited?: boolean
  className?: string
  /** Renders a text label next to the heart ("Save" / "Saved"). */
  showLabel?: boolean
}

export function FavoriteButton({
  listingId,
  initialFavorited = false,
  className,
  showLabel = false,
}: FavoriteButtonProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useCurrentUser()
  const toggle = useToggleFavorite()

  // Follows the server value whenever a refreshed DTO changes it (derived state, no effect).
  const [state, setState] = useState({ source: initialFavorited, value: initialFavorited })
  if (state.source !== initialFavorited) {
    setState({ source: initialFavorited, value: initialFavorited })
  }
  const favorited = state.value

  function handleToggle(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (isLoading || toggle.isPending) return

    if (!isAuthenticated) {
      const here = window.location.pathname + window.location.search
      router.push(`/login?next=${encodeURIComponent(here)}`)
      return
    }

    const next = !favorited
    setState((prev) => ({ ...prev, value: next }))
    toggle.mutate(
      { listingId, favorited: next },
      { onError: () => setState((prev) => ({ ...prev, value: !next })) }
    )
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      aria-pressed={favorited}
      data-listing-id={listingId}
      className={cn(
        showLabel
          ? "flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
          : "flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-xs text-white transition-all hover:bg-black/65 active:scale-90",
        !showLabel && favorited && "bg-black/60 text-accent",
        showLabel && favorited && "text-destructive",
        className
      )}
    >
      <Heart
        size={showLabel ? 17 : 15}
        weight={favorited ? "fill" : "bold"}
        className="transition-transform"
      />
      {showLabel && <span>{favorited ? "Saved" : "Save"}</span>}
    </button>
  )
}
