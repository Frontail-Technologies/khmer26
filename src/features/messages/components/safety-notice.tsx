"use client"

import { useState } from "react"
import { ShieldWarning, X, Info } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function SafetyNotice() {
  const [dismissed, setDismissed] = useState(false)
  const [tipsOpen, setTipsOpen] = useState(false)

  if (dismissed) return null

  return (
    <>
      <div className="mx-3 my-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldWarning size={16} weight="fill" className="text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-foreground text-[11px] sm:text-xs">
              Stay safe on Khmer26:{" "}
            </span>
            <span className="text-[11px] sm:text-xs text-muted-foreground truncate">
              Avoid advance payments before in-person inspection.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setTipsOpen(true)}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            Tips
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground p-0.5"
            aria-label="Dismiss safety notice"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <Dialog open={tipsOpen} onOpenChange={setTipsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
              <Info size={22} weight="bold" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Marketplace Safety Tips
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Follow these recommended practices for safe trading in Cambodia.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1 text-xs text-muted-foreground">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="font-bold text-foreground block">1. Meet in public locations</span>
              <p>Meet in busy public areas like shopping malls, cafes, or verified dealer showrooms.</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="font-bold text-foreground block">2. Inspect before paying</span>
              <p>Check vehicle condition, original registration documents, and electronics serial numbers.</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <span className="font-bold text-foreground block">3. Use Bakong or direct bank transfer</span>
              <p>Pay only after receiving and verifying the physical item and receipt.</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTipsOpen(false)}
              className="text-xs font-semibold h-9.5 w-full sm:w-auto"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
