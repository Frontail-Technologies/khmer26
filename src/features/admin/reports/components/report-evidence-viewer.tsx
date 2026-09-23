"use client"

import { useState } from "react"
import Image from "next/image"
import {
  FileText,
  FileImage,
  MagnifyingGlassPlus,
  Paperclip,
  CheckCircle,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { AdminReportEvidence } from "../types"

interface ReportEvidenceViewerProps {
  evidence: AdminReportEvidence[]
}

export function ReportEvidenceViewer({ evidence }: ReportEvidenceViewerProps) {
  const [selectedImage, setSelectedImage] = useState<AdminReportEvidence | null>(
    null
  )

  return (
    <>
      <Card className="rounded-xl bg-card p-0 shadow-2xs overflow-hidden border-0">
        <CardHeader className="p-3.5 sm:p-4 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="size-6.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Paperclip size={14} weight="bold" />
            </div>
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
                Submitted Evidence & Attachments
              </CardTitle>
              <p className="text-[10px] text-muted-foreground">
                Supporting files and text snippets submitted by reporter
              </p>
            </div>
          </div>

          <Badge variant="outline" className="text-[10px] font-semibold">
            {evidence.length} {evidence.length === 1 ? "Item" : "Items"}
          </Badge>
        </CardHeader>

        <CardContent className="p-3.5 sm:p-4">
          {evidence.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-border/70 rounded-xl space-y-1 bg-muted/10">
              <p className="text-xs font-semibold text-foreground">
                No attachments submitted
              </p>
              <p className="text-[11px] text-muted-foreground">
                The reporter filed this case without supplementary screenshots.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {evidence.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/70 bg-card p-3 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="size-6 rounded-md bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                        {item.type === "image" || item.type === "screenshot" ? (
                          <FileImage size={13} weight="bold" />
                        ) : (
                          <FileText size={13} weight="bold" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground capitalize block">
                          {item.type.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <Badge variant="secondary" className="text-[9px] font-semibold uppercase shrink-0">
                      Attached
                    </Badge>
                  </div>

                  {item.url && (
                    <div
                      className="relative aspect-video rounded-lg overflow-hidden border border-border/60 bg-muted/30 group cursor-pointer"
                      onClick={() => setSelectedImage(item)}
                    >
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover transition-transform group-hover:scale-105 duration-200"
                      />
                      <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-xs font-bold text-foreground">
                        <MagnifyingGlassPlus size={16} weight="bold" />
                        <span>View Full Image</span>
                      </div>
                    </div>
                  )}

                  {item.content && (
                    <div className="bg-muted/30 border border-border/50 rounded-lg p-2.5 text-xs font-mono text-muted-foreground leading-relaxed">
                      {item.content}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                    <span>Uploaded {item.uploadedAt || "with report"}</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle size={12} weight="bold" />
                      <span>Verified format</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selectedImage)}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-3xl p-5 space-y-4 rounded-xl bg-card border-0 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {selectedImage?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedImage?.url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/60 bg-muted/40">
              <Image
                src={selectedImage.url}
                alt={selectedImage.title}
                fill
                sizes="800px"
                className="object-contain"
              />
            </div>
          )}

          {selectedImage?.content && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedImage.content}
            </p>
          )}

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedImage(null)}
              className="h-8 text-xs rounded-lg cursor-pointer"
            >
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
