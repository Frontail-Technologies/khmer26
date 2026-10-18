"use client"

import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"

import { Trash, Warning } from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { AccountListingItem } from "../../types"

interface DeleteListingDialogProps {
  listing: AccountListingItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string) => void
}

export function DeleteListingDialog({
  listing,
  open,
  onOpenChange,
  onConfirm,
}: DeleteListingDialogProps) {
  const tDynamic = useTranslations("dynamic")
  if (!listing) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-1">
            <Warning size={22} weight="bold" />
          </div>
          <DialogTitle className="text-lg font-bold">
            <LocalizedText id="deleteListing_3090bd" />
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {tDynamic("deleteListingNamed", { title: listing.title })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:flex-1 text-xs font-semibold h-10"
          >
            <LocalizedText id="cancel" />
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm(listing.id)
              onOpenChange(false)
            }}
            className="w-full sm:flex-1 text-xs font-semibold h-10 gap-1.5"
          >
            <Trash size={16} />
            <span><LocalizedText id="deleteListing" /></span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
