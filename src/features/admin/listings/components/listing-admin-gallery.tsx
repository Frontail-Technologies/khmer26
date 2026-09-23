"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, Images, X } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { AdminListingImage } from "../types"

interface ListingAdminGalleryProps {
  images: AdminListingImage[]
  title: string
}

export function ListingAdminGallery({ images, title }: ListingAdminGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)

  if (images.length === 0) {
    return (
      <Card className="rounded-xl border border-border/70 bg-card p-6 text-center">
        <Images size={36} className="mx-auto text-muted-foreground/60 mb-2" />
        <p className="text-xs font-semibold text-foreground">No images submitted</p>
        <p className="text-[11px] text-muted-foreground">
          This listing does not have any attached photographs.
        </p>
      </Card>
    )
  }

  const currentImage = images[selectedIndex] || images[0]

  return (
    <>
      <Card className="rounded-xl border border-border/70 bg-card p-0 shadow-none overflow-hidden space-y-0">
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-lg overflow-hidden bg-muted/40 border border-border/60 group">
            <Image
              src={currentImage.url}
              alt={currentImage.alt || title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover transition-transform duration-300 group-hover:scale-101"
            />

            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
              <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {selectedIndex + 1} / {images.length}
              </span>
              <Button
                variant="secondary"
                size="icon-xs"
                onClick={() => setFullscreenOpen(true)}
                className="size-7 bg-black/70 hover:bg-black/90 text-white border-0 cursor-pointer shadow-sm"
                aria-label="Fullscreen preview"
              >
                <Eye size={14} />
              </Button>
            </div>

            {currentImage.isPrimary && (
              <div className="absolute bottom-2.5 left-2.5">
                <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                  Cover Photo
                </span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {images.map((img, idx) => {
                const isSelected = idx === selectedIndex
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative size-14 sm:size-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 scale-102"
                        : "border-border/70 opacity-70 hover:opacity-100 hover:border-border"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `Photo ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="max-w-4xl p-3 sm:p-5 bg-black/95 border-border/20 text-white rounded-xl">
          <DialogHeader className="flex flex-row items-center justify-between pb-2">
            <DialogTitle className="text-xs sm:text-sm font-semibold truncate text-white/90">
              {title} — Photo {selectedIndex + 1} of {images.length}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setFullscreenOpen(false)}
              className="text-white hover:bg-white/10 size-7"
            >
              <X size={16} />
            </Button>
          </DialogHeader>

          <div className="relative aspect-16/10 w-full rounded-lg overflow-hidden bg-black/50">
            <Image
              src={currentImage.url}
              alt={currentImage.alt || title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative size-12 rounded-md overflow-hidden border-2 shrink-0 cursor-pointer ${
                    idx === selectedIndex ? "border-primary" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
