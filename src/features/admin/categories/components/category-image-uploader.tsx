"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Image as ImageIcon, UploadSimple, Trash, ArrowClockwise, WarningCircle } from "@phosphor-icons/react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryImageUploaderProps {
  value?: string
  onChange: (imageUrl?: string) => void
  label?: string
  description?: string
  className?: string
}

export function CategoryImageUploader({
  value,
  onChange,
  label = "Category Image",
  description = "Supports WebP, PNG, or JPG up to 5MB. Used across category cards, directory, and headers.",
  className,
}: CategoryImageUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>(value)
  const [isDragging, setIsDragging] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setErrorMessage(null)

    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please upload a WebP, PNG, or JPG image.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size must be 5MB or less.")
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    onChange(objectUrl)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    setPreview(undefined)
    setErrorMessage(null)
    onChange(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Field className={cn("gap-2", className)}>
      <div className="flex items-center justify-between">
        <FieldLabel>{label}</FieldLabel>
        {preview && (
          <span className="text-[11px] text-muted-foreground font-medium">Image attached</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border/70 bg-muted/20 group p-3 flex items-center gap-4">
          <div className="relative size-20 sm:size-24 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/50">
            <Image
              src={preview}
              alt="Category Preview"
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-xs font-bold text-foreground truncate">
              {preview.startsWith("blob:") ? "New uploaded image" : preview.split("/").pop()}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Ready for preview in Admin & Marketplace
            </p>

            <div className="flex items-center gap-2 pt-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 px-2.5 text-[11px] font-semibold gap-1 rounded-lg cursor-pointer"
              >
                <ArrowClockwise size={12} weight="bold" />
                <span>Replace</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-7 px-2.5 text-[11px] font-semibold gap-1 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
              >
                <Trash size={12} weight="bold" />
                <span>Remove</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border/70 hover:border-border hover:bg-muted/30 bg-muted/10"
          )}
        >
          <div className="size-10 rounded-full bg-background border border-border/60 shadow-2xs flex items-center justify-center text-muted-foreground">
            {isDragging ? (
              <UploadSimple size={20} weight="bold" className="text-primary animate-pulse" />
            ) : (
              <ImageIcon size={20} weight="duotone" />
            )}
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold text-foreground">
              <span className="text-primary hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-muted-foreground max-w-xs">{description}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-destructive text-[11px] font-medium pt-0.5">
          <WarningCircle size={14} weight="fill" />
          <span>{errorMessage}</span>
        </div>
      )}
    </Field>
  )
}
