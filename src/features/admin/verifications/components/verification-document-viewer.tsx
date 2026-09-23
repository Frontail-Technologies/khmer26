"use client"

import Image from "next/image"
import {
  CaretLeft,
  CaretRight,
  X,
  FilePdf,
  FileImage,
} from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { VerificationDocument } from "../types"

interface VerificationDocumentViewerProps {
  documents: VerificationDocument[]
  selectedIndex: number | null
  onClose: () => void
  onSelectIndex: (index: number) => void
}

export function VerificationDocumentViewer({
  documents,
  selectedIndex,
  onClose,
  onSelectIndex,
}: VerificationDocumentViewerProps) {
  if (selectedIndex === null || !documents[selectedIndex]) return null

  const currentDoc = documents[selectedIndex]
  const hasPrev = selectedIndex > 0
  const hasNext = selectedIndex < documents.length - 1
  const isPdf = currentDoc.fileType.includes("pdf")

  return (
    <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border/80 rounded-2xl flex flex-col max-h-[90dvh]">
        <DialogHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="space-y-0.5 min-w-0 pr-6">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-sm font-bold text-foreground truncate">
                {currentDoc.title}
              </DialogTitle>
              <Badge variant="outline" className="text-[10px] uppercase font-semibold h-4.5 px-1.5 shrink-0">
                Doc {selectedIndex + 1} of {documents.length}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {currentDoc.fileSize} • {currentDoc.fileType} • Uploaded {currentDoc.uploadedAt}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            aria-label="Close document viewer"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </Button>
        </DialogHeader>

        <div className="relative flex-1 min-h-[350px] sm:min-h-[480px] bg-muted/30 flex items-center justify-center p-4 overflow-auto">
          {isPdf ? (
            <div className="text-center space-y-3 p-8">
              <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                <FilePdf size={36} />
              </div>
              <div className="space-y-1 max-w-sm">
                <p className="text-xs font-bold text-foreground">{currentDoc.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  Official PDF document uploaded by seller for administrative verification.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full min-h-[350px] sm:min-h-[480px] flex items-center justify-center">
              <Image
                src={currentDoc.fileUrl}
                alt={currentDoc.title}
                width={800}
                height={600}
                className="max-h-[65dvh] w-auto object-contain rounded-lg shadow-sm border border-border/40"
                priority
              />
            </div>
          )}

          {hasPrev && (
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={() => onSelectIndex(selectedIndex - 1)}
              aria-label="Previous document"
              className="absolute left-4 top-1/2 -translate-y-1/2 size-9 rounded-full shadow-md bg-card/90 backdrop-blur-xs border border-border/80 text-foreground cursor-pointer"
            >
              <CaretLeft size={18} weight="bold" />
            </Button>
          )}

          {hasNext && (
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={() => onSelectIndex(selectedIndex + 1)}
              aria-label="Next document"
              className="absolute right-4 top-1/2 -translate-y-1/2 size-9 rounded-full shadow-md bg-card/90 backdrop-blur-xs border border-border/80 text-foreground cursor-pointer"
            >
              <CaretRight size={18} weight="bold" />
            </Button>
          )}
        </div>

        <div className="p-3 border-t border-border/70 bg-card flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
            {isPdf ? <FilePdf size={15} /> : <FileImage size={15} />}
            <span>Confidential seller verification record</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrev}
              onClick={() => onSelectIndex(selectedIndex - 1)}
              className="h-8 text-xs font-semibold gap-1"
            >
              <CaretLeft size={13} weight="bold" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext}
              onClick={() => onSelectIndex(selectedIndex + 1)}
              className="h-8 text-xs font-semibold gap-1"
            >
              <span>Next</span>
              <CaretRight size={13} weight="bold" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
