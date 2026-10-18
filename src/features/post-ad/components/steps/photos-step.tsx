"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  UploadSimple,
  Trash,
  Star,
  Lightbulb,
  WarningCircle,
  ArrowClockwise,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useMediaUpload } from "@/hooks/use-media-upload"
import { usePublicSettings } from "@/features/settings/api/public-settings"
import type { UploadedPhoto } from "../../types"

interface PhotosStepProps {
  photos: UploadedPhoto[]
  onChange: (photos: UploadedPhoto[]) => void
  error?: string
}

const DEFAULT_MAX_PHOTOS = 12
const MAX_SIZE_MB = 10

export function PhotosStep({ photos, onChange, error }: PhotosStepProps) {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: publicSettings } = usePublicSettings()
  const maxPhotos = publicSettings?.maxListingImages ?? DEFAULT_MAX_PHOTOS
  const [dragOver, setDragOver] = useState(false)
  const [coverId, setCoverId] = useState<string | undefined>(
    photos.find((photo) => photo.isCover)?.id
  )
  const uploader = useMediaUpload({
    purpose: "listing_image",
    max: maxPhotos,
    initialItems: photos.map((photo) => ({
      id: photo.id,
      file: photo.file,
      name: photo.name,
      size: photo.size,
      previewUrl: photo.previewUrl,
      progress: photo.uploadProgress ?? 100,
      status: photo.uploadStatus ?? "done",
      mediaId: photo.mediaId,
      error: photo.uploadError,
    })),
  })
  const effectiveCoverId = coverId && uploader.items.some((item) => item.id === coverId)
    ? coverId
    : uploader.items[0]?.id

  useEffect(() => {
    onChange(uploader.items.map((item) => ({
      id: item.id,
      file: item.file,
      previewUrl: item.previewUrl,
      name: item.file?.name ?? item.name ?? "Listing photo",
      size: item.file?.size ?? item.size ?? 0,
      isCover: item.id === effectiveCoverId,
      mediaId: item.mediaId,
      uploadProgress: item.progress,
      uploadStatus: item.status,
      uploadError: item.error,
    })))
  }, [effectiveCoverId, onChange, uploader.items])

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    uploader.addFiles(files)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    processFiles(e.dataTransfer.files)
  }

  const handleRemove = (id: string) => {
    if (id === effectiveCoverId) setCoverId(undefined)
    uploader.remove(id)
  }

  const handleSetCover = (id: string) => {
    setCoverId(id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          {tDynamic("photosCount", { count: photos.length, max: maxPhotos })}
        </h2>
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
            : error || uploader.rejections.length > 0
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
          <LocalizedText id="clickToUploadOrDragPhotosHere" />
        </span>
        <span className="text-xxs text-muted-foreground">
          {tDynamic("photoSupport", { max: MAX_SIZE_MB })}
        </span>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-4 text-xs font-semibold h-9 pointer-events-none"
        >
          <LocalizedText id="selectPhotosFromDevice" />
        </Button>
      </div>

      {(error || uploader.rejections.length > 0) && (
        <div className="flex items-center gap-1.5 text-destructive text-xs font-medium">
          <WarningCircle size={16} weight="bold" />
          <span>{uploader.rejections[0] || error}</span>
        </div>
      )}

      {photos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span><LocalizedText id="uploadedPhotos" /></span>
            <span className="text-xxs"><LocalizedText id="clickStarIconToSelectCoverPhoto" /></span>
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
                  unoptimized={photo.previewUrl.startsWith("blob:")}
                  className="object-cover"
                />

                {photo.isCover && (
                  <div className="absolute top-1.5 left-1.5 z-10 rounded bg-primary text-primary-foreground px-1.5 py-0.5 text-3xs font-black uppercase tracking-wider shadow-xs">
                    <LocalizedText id="coverPhoto" />
                  </div>
                )}

                {photo.uploadStatus === "uploading" && (
                  <div className="absolute inset-x-0 bottom-0 bg-background/90 p-1.5">
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary transition-[width]" style={{ width: `${photo.uploadProgress ?? 0}%` }} />
                    </div>
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
                      title={tGenerated("setAsCoverPhoto")}
                      aria-label={tGenerated("setAsCoverPhoto")}
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
                    title={tGenerated("deletePhoto")}
                    aria-label={tGenerated("deletePhoto")}
                    className="h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Trash size={16} weight="bold" />
                  </button>

                  {photo.uploadStatus === "error" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        uploader.retry(photo.id)
                      }}
                      title={tGenerated("retryUpload")}
                      aria-label={tGenerated("retryUpload")}
                      className="h-8 w-8 rounded-full bg-background text-foreground flex items-center justify-center cursor-pointer"
                    >
                      <ArrowClockwise size={16} weight="bold" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-xs">
          <Lightbulb size={16} weight="fill" />
          <span><LocalizedText id="photoQualityTips" /></span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li><LocalizedText id="takePhotosInBrightNaturalDaylight" /></li>
          <li><LocalizedText id="captureAllAnglesIncludingAnyMinorCosmeticFlaws" /></li>
          <li><LocalizedText id="avoidWatermarkedOrScreenshotImagesForHigherBuyerTrust" /></li>
        </ul>
      </div>
    </div>
  )
}
