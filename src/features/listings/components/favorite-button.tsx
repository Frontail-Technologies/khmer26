"use client"

import { cn } from "@/lib/utils"
import { Heart } from "@phosphor-icons/react"
import { useState, type MouseEvent } from "react"

interface FavoriteButtonProps {
  listingId: string
  initialFavorited?: boolean
  className?: string
}

export function FavoriteButton({
  listingId,
  initialFavorited = false,
  className,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited)

  function handleToggle(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
    setFavorited(!favorited)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      aria-pressed={favorited}
      data-listing-id={listingId}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-xs text-white transition-all hover:bg-black/65 active:scale-90",
        favorited && "bg-black/60 text-accent",
        className
      )}
    >
      <Heart
        size={15}
        weight={favorited ? "fill" : "bold"}
        className="transition-transform"
      />
    </button>
  )
}
