"use client"

import { useState } from "react"
import { NotePencil, PaperPlaneTilt, User } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { AdminReportInternalNote } from "../types"

interface ReportInternalNotesProps {
  notes: AdminReportInternalNote[]
}

export function ReportInternalNotes({ notes }: ReportInternalNotesProps) {
  const [noteContent, setNoteContent] = useState("")

  return (
    <Card className="rounded-xl bg-card p-0 shadow-2xs overflow-hidden border-0">
      <CardHeader className="p-3.5 sm:p-4 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-6.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <NotePencil size={14} weight="bold" />
          </div>
          <div>
            <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
              Internal Moderation Notes
            </CardTitle>
            <p className="text-[10px] text-muted-foreground">
              Staff-only communication and investigation memos
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground">
          Staff Only
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4 space-y-4">
        {notes.length === 0 ? (
          <p className="text-xs text-muted-foreground py-1">
            No internal notes recorded on this case yet.
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-muted-foreground" />
                    <span className="font-bold text-foreground">{note.author}</span>
                    <Badge variant="secondary" className="text-[9px] font-semibold py-0 h-4">
                      {note.authorRole}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {note.timestamp}
                  </span>
                </div>
                <p className="text-foreground text-xs leading-relaxed">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-border/60 space-y-3">
          <Field className="gap-2">
            <FieldLabel>Add Internal Note</FieldLabel>
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Record investigation findings, seller contact attempts, or coordination notes..."
              className="min-h-20 text-xs bg-muted/30 rounded-xl"
            />
          </Field>
          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={!noteContent.trim()}
              onClick={() => setNoteContent("")}
              className="h-8 text-xs bg-primary text-primary-foreground font-semibold gap-1.5 rounded-lg cursor-pointer disabled:opacity-50"
            >
              <PaperPlaneTilt size={13} weight="bold" />
              <span>Record Note</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
