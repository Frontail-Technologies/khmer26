"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "@phosphor-icons/react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdminImagePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string
  alt: string
}

export function AdminImagePreviewDialog({
  open,
  onOpenChange,
  src,
  alt,
}: AdminImagePreviewDialogProps) {
  if (!src) return null

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className={cn(
            "fixed inset-0 z-90 bg-black/80 backdrop-blur-xs transition-opacity duration-200 ease-out",
            "data-starting-style:opacity-0 data-ending-style:opacity-0"
          )}
        />
        <DialogPrimitive.Popup
          className={cn(
            "fixed inset-0 z-90 flex items-center justify-center p-4 sm:p-8 outline-none pointer-events-none transition-all duration-200 ease-out",
            "data-starting-style:opacity-0 data-starting-style:scale-90",
            "data-ending-style:opacity-0 data-ending-style:scale-90"
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {alt || "Image Preview"}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Enlarged preview of thumbnail image
          </DialogPrimitive.Description>

          <div className="relative max-w-[90vw] max-h-[90dvh] flex items-center justify-center pointer-events-auto rounded-xl overflow-hidden shadow-2xl bg-black/30 border border-white/10">
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={900}
              unoptimized
              priority
              className="max-w-[90vw] max-h-[90dvh] w-auto h-auto object-contain select-none rounded-xl"
            />

            <DialogPrimitive.Close
              render={
                <Button
                  variant="secondary"
                  size="icon-xs"
                  className="absolute top-3 right-3 size-7 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-md cursor-pointer transition-transform hover:scale-105"
                  aria-label="Close image preview"
                >
                  <X size={14} weight="bold" />
                </Button>
              }
            />
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

interface AdminImageThumbnailProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
}

export function AdminImageThumbnail({
  src,
  alt,
  className,
  containerClassName,
  width,
  height,
  fill = true,
  sizes = "48px",
}: AdminImageThumbnailProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsPreviewOpen(true)
        }}
        className={cn(
          "relative overflow-hidden group cursor-zoom-in text-left focus:outline-none focus:ring-1 focus:ring-primary rounded-lg",
          containerClassName
        )}
        aria-label={`View enlarged preview of ${alt}`}
      >
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={cn(
              "object-cover transition-transform duration-150 group-hover:scale-105",
              className
            )}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width ?? 48}
            height={height ?? 48}
            className={cn(
              "object-cover transition-transform duration-150 group-hover:scale-105",
              className
            )}
          />
        )}
      </button>

      <AdminImagePreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        src={src}
        alt={alt}
      />
    </>
  )
}
