"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, FilePdf, FileImage, ShieldCheck } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VerificationDocumentViewer } from "./verification-document-viewer"
import type { VerificationDocument } from "../types"

interface VerificationDocumentsProps {
  documents: VerificationDocument[]
}

export function VerificationDocuments({ documents }: VerificationDocumentsProps) {
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null)

  return (
    <>
      <Card className="rounded-xl bg-card p-0 shadow-2xs overflow-hidden border-0">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <CardTitle className="text-sm sm:text-base font-bold text-foreground">
              Submitted Documents
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {documents.length} official verification document{documents.length !== 1 ? "s" : ""} attached
            </p>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
            <ShieldCheck size={16} className="text-primary shrink-0" />
            <span>Admin-only access</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {documents.map((doc, index) => {
              const isPdf = doc.fileType.includes("pdf")

              return (
                <div
                  key={doc.id}
                  className="group/doc relative rounded-xl border border-border/70 bg-background overflow-hidden flex flex-col justify-between hover:border-border transition-all"
                >
                  <div className="relative h-40 w-full bg-muted/40 overflow-hidden flex items-center justify-center">
                    {isPdf ? (
                      <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                        <FilePdf size={40} className="text-destructive" />
                        <span className="text-[10px] font-semibold uppercase">PDF Document</span>
                      </div>
                    ) : (
                      <Image
                        src={doc.fileUrl}
                        alt={doc.title}
                        width={400}
                        height={200}
                        className="h-full w-full object-cover group-hover/doc:scale-105 transition-transform duration-300"
                      />
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedDocIndex(index)}
                        className="h-8.5 px-3 text-xs font-semibold bg-card text-foreground hover:bg-card/90 gap-1.5 shadow-md cursor-pointer"
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-bold text-foreground line-clamp-1">
                        {doc.title}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[9px] font-semibold uppercase px-1.5 py-0 h-4 shrink-0"
                      >
                        {doc.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {isPdf ? <FilePdf size={13} /> : <FileImage size={13} />}
                        <span>{doc.fileSize}</span>
                      </div>
                      <span>Uploaded {doc.uploadedAt}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <VerificationDocumentViewer
        documents={documents}
        selectedIndex={selectedDocIndex}
        onClose={() => setSelectedDocIndex(null)}
        onSelectIndex={setSelectedDocIndex}
      />
    </>
  )
}
