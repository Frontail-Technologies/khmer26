import Image from "next/image"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { cn } from "@/lib/utils"

interface CategoryThumbProps {
  imageR2Key: string | null
  name: string
  /** Edge length in px. */
  size: number
  className?: string
}

/** The category's own image, or its first letter on a tinted tile when it has none. */
export function CategoryThumb({ imageR2Key, name, size, className }: CategoryThumbProps) {
  const url = getMediaUrl(imageR2Key)
  const box = { width: size, height: size }

  if (url) {
    return (
      <Image
        src={url}
        alt=""
        width={size}
        height={size}
        className={cn("shrink-0 bg-muted object-cover", className)}
        style={box}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn("flex shrink-0 items-center justify-center bg-primary/10 font-bold text-primary/70", className)}
      style={{ ...box, fontSize: Math.max(11, Math.round(size * 0.4)) }}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  )
}
