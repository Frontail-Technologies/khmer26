"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye } from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ImageMessageProps {
  imageUrl: string
  imageAlt?: string
  content?: string
  isCurrentUser: boolean
}

export function ImageMessage({
  imageUrl,
  imageAlt = "Message attachment",
  content,
}: ImageMessageProps) {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <>
      <div className="space-y-1.5 max-w-xs">
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="relative aspect-4/3 w-60 rounded-xl overflow-hidden bg-muted border border-border/80 group cursor-pointer block text-left"
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="300px"
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-black/60 text-white">
              <Eye size={18} />
            </span>
          </div>
        </button>

        {content && (
          <p className="text-xs text-foreground leading-relaxed px-1">
            {content}
          </p>
        )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl p-2 bg-background/95 border-none shadow-2xl">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <div className="relative aspect-4/3 sm:aspect-16/10 w-full rounded-lg overflow-hidden bg-black">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="800px"
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
