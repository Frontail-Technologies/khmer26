import { ImageSquare } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { AdminListingImage } from "../types"

const MAX_VISIBLE = 4

interface ListingImageAvatarsProps {
  images: AdminListingImage[]
  title: string
  size?: "default" | "lg"
  className?: string
}

/** One avatar for a single photo, an overlapping group (capped, with a "+N" count) for several. */
export function ListingImageAvatars({ images, title, size = "default", className }: ListingImageAvatarsProps) {
  const label = images.length === 1 ? `1 photo of ${title}` : `${images.length} photos of ${title}`

  if (images.length <= 1) {
    const image = images[0]
    return (
      <Avatar size={size} className={cn("size-11", className)} role="img" aria-label={label}>
        {image && <AvatarImage src={image.url} alt="" />}
        <AvatarFallback>
          <ImageSquare size={18} aria-hidden="true" />
        </AvatarFallback>
      </Avatar>
    )
  }

  const visible = images.slice(0, MAX_VISIBLE)
  const hidden = images.length - visible.length

  return (
    <AvatarGroup className={cn("shrink-0", className)} role="img" aria-label={label}>
      {visible.map((image) => (
        <Avatar key={image.id} size={size} className="size-9">
          <AvatarImage src={image.url} alt="" />
          <AvatarFallback>
            <ImageSquare size={14} aria-hidden="true" />
          </AvatarFallback>
        </Avatar>
      ))}
      {hidden > 0 && <AvatarGroupCount className="size-9 text-xxs font-bold">+{hidden}</AvatarGroupCount>}
    </AvatarGroup>
  )
}
