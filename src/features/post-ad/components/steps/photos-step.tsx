"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import {
  UploadSimple,
  Trash,
  Star,
  Lightbulb,
  WarningCircle,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import type { UploadedPhoto } from "../../types"

interface PhotosStepProps {
  photos: UploadedPhoto[]
  onChange: (photos: UploadedPhoto[]) => void
  error?: string
}

const MAX_PHOTOS = 12
const MAX_SIZE_MB = 10

export function PhotosStep({ photos, onChange, error }: PhotosStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploadError(null)

    const remainingSlots = MAX_PHOTOS - photos.length
    if (remainingSlots <= 0) {
      setUploadError(`Maximum ${MAX_PHOTOS} photos allowed.`)
      return
    }

    const validFiles: File[] = []
    const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i]
      if (!file) continue

      if (!acceptedTypes.includes(file.type)) {
        setUploadError("Only JPEG, PNG, and WebP images are supported.")
        continue
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`Images must be under ${MAX_SIZE_MB}MB each.`)
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    const newPhotos: UploadedPhoto[] = validFiles.map((file, idx) => ({
      id: `photo-${Date.now()}-${idx}`,
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      isCover: photos.length === 0 && idx === 0,
    }))

    onChange([...photos, ...newPhotos])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    processFiles(e.dataTransfer.files)
  }

  const handleRemove = (id: string) => {
    const updated = photos.filter((p) => p.id !== id)
    if (updated.length > 0 && !updated.some((p) => p.isCover)) {
      updated[0]!.isCover = true
    }
    onChange(updated)
  }

  const handleSetCover = (id: string) => {
    const updated = photos.map((p) => ({
      ...p,
      isCover: p.id === id,
    }))
    onChange(updated)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          Photos ({photos.length}/{MAX_PHOTOS})
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Listings with multiple clear photos receive 5x more buyer inquiries
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
          dragOver
            ? "border-primary bg-primary/10"
            : error || uploadError
            ? "border-destructive/80 bg-destructive/5"
            : "border-border hover:border-primary/60 hover:bg-muted/40 bg-card"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          multiple
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />

        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          <UploadSimple size={24} weight="bold" />
        </div>

        <span className="text-xs sm:text-sm font-bold text-foreground mb-1">
          Click to upload or drag photos here
        </span>
        <span className="text-[11px] text-muted-foreground">
          Supported: JPG, PNG, WebP up to {MAX_SIZE_MB}MB each
        </span>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-4 text-xs font-semibold h-9 pointer-events-none"
        >
          Select Photos from Device
        </Button>
      </div>

      {(error || uploadError) && (
        <div className="flex items-center gap-1.5 text-destructive text-xs font-medium">
          <WarningCircle size={16} weight="bold" />
          <span>{uploadError || error}</span>
        </div>
      )}

      {photos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploaded Photos</span>
            <span className="text-[11px]">Click star icon to select Cover Photo</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`relative aspect-4/3 rounded-xl overflow-hidden border bg-muted group ${
                  photo.isCover ? "border-primary ring-2 ring-primary" : "border-border"
                }`}
              >
                <Image
                  src={photo.previewUrl}
                  alt={photo.name}
                  fill
                  sizes="200px"
                  className="object-cover"
                />

                {photo.isCover && (
                  <div className="absolute top-1.5 left-1.5 z-10 rounded bg-primary text-primary-foreground px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-xs">
                    Cover Photo
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!photo.isCover && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSetCover(photo.id)
                      }}
                      title="Set as cover photo"
                      aria-label="Set as cover photo"
                      className="h-8 w-8 rounded-full bg-background/80 hover:bg-background text-foreground flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Star size={16} weight="bold" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(photo.id)
                    }}
                    title="Delete photo"
                    aria-label="Delete photo"
                    className="h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-xs">
          <Lightbulb size={16} weight="fill" />
          <span>Photo Quality Tips</span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Take photos in bright, natural daylight</li>
          <li>Capture all angles, including any minor cosmetic flaws</li>
          <li>Avoid watermarked or screenshot images for higher buyer trust</li>
        </ul>
      </div>
    </div>
  )
}
