"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { Prohibit, Warning } from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { ConversationParticipant } from "../types"

interface BlockUserDialogProps {
  participant: ConversationParticipant
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmBlock: () => void
  isBlocked?: boolean
}

export function BlockUserDialog({
  participant,
  open,
  onOpenChange,
  onConfirmBlock,
  isBlocked = false,
}: BlockUserDialogProps) {
  const tGenerated = useTranslations("generated")
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-1">
            <Warning size={22} weight="bold" />
          </div>
          <DialogTitle className="text-lg font-bold">
            {isBlocked ? tGenerated("unblock") : tGenerated("block")} {participant.name}?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isBlocked
              ? tGenerated("youWillBothBeAbleToMessageEachOther")
              : tGenerated("theyWillNoLongerBeAbleToMessageYou")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:flex-1 text-xs font-semibold h-9.5"
          >
            <LocalizedText id="cancel" />
          </Button>
          <Button
            type="button"
            variant={isBlocked ? "default" : "destructive"}
            onClick={() => {
              onConfirmBlock()
              onOpenChange(false)
            }}
            className="w-full sm:flex-1 text-xs font-bold h-9.5 gap-1.5"
          >
            <Prohibit size={16} />
            <span>{isBlocked ? tGenerated("unblockUser") : tGenerated("blockUser")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
