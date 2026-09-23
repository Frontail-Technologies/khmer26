"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CheckCircle,
  XCircle,
  Trash,
  User,
  ArrowSquareOut,
  Flag,
  WarningCircle,
} from "@phosphor-icons/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
  type SelectOption,
} from "@/components/ui/select"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { ApproveListingDialog } from "./approve-listing-dialog"
import { RejectListingDialog } from "./reject-listing-dialog"
import { RemoveListingDialog } from "./remove-listing-dialog"
import type { AdminListing, AdminListingStatus } from "../types"

interface ListingModerationPanelProps {
  listing: AdminListing
}

const STATUS_TONE_MAP: Record<AdminListingStatus, StatusTone> = {
  pending: "warning",
  flagged: "destructive",
  active: "success",
  sold: "neutral",
  expired: "neutral",
  rejected: "destructive",
  removed: "destructive",
  draft: "neutral",
}

const STATUS_LABEL_MAP: Record<AdminListingStatus, string> = {
  pending: "Pending Review",
  flagged: "Flagged for Review",
  active: "Active & Published",
  sold: "Sold Out",
  expired: "Expired",
  rejected: "Rejected",
  removed: "Removed / Taken Down",
  draft: "Draft",
}

const MODERATOR_OPTIONS: SelectOption[] = [
  { value: "unassigned", label: "Unassigned" },
  { value: "Dara Sok", label: "Dara Sok — Super Admin" },
  { value: "Channary Meas", label: "Channary Meas — Moderator" },
  { value: "Vannak Lim", label: "Vannak Lim — Moderator" },
]

export function ListingModerationPanel({ listing }: ListingModerationPanelProps) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [assignedAdmin, setAssignedAdmin] = useState(listing.assignedTo || "unassigned")

  const isPublic = listing.status === "active" && Boolean(listing.slug)

  return (
    <>
      <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden space-y-0 lg:sticky lg:top-20">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Moderation Decision
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-muted-foreground">Current Status</span>
              <StatusBadge
                label={STATUS_LABEL_MAP[listing.status]}
                tone={STATUS_TONE_MAP[listing.status]}
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-muted-foreground">Listing ID</span>
              <span className="font-mono font-bold text-foreground">{listing.id}</span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium text-foreground">{listing.categoryName}</span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-muted-foreground">Seller</span>
              <span className="font-semibold text-foreground truncate max-w-36">
                {listing.seller.name}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-muted-foreground">Submitted</span>
              <span className="font-medium text-foreground">{listing.createdDate}</span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-muted-foreground">Community Flags</span>
              {listing.reports.length > 0 ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive">
                  <Flag size={12} weight="fill" />
                  <span>{listing.reports.length} reports</span>
                </span>
              ) : (
                <span className="text-muted-foreground font-medium">None</span>
              )}
            </div>

            <div className="pb-2.5 border-b border-border/60">
              <Field className="gap-2">
                <FieldLabel className="flex items-center gap-1">
                  <User size={13} />
                  <span>Assigned Moderator</span>
                </FieldLabel>
                <Select
                  value={assignedAdmin}
                  items={MODERATOR_OPTIONS}
                  onValueChange={(val) => val && setAssignedAdmin(val)}
                >
                  <SelectTrigger className="h-8.5 w-full text-xs">
                    <SelectValue placeholder="Select Moderator">
                      {(val) => getSelectOptionLabel(MODERATOR_OPTIONS, val, "Select Moderator")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {MODERATOR_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {listing.riskLevel && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Safety Assessment</span>
                <span
                  className={`font-bold uppercase text-[10px] ${
                    listing.riskLevel === "low"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : listing.riskLevel === "medium"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-destructive"
                  }`}
                >
                  {listing.riskLevel} Risk
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-border/60">
            {(listing.status === "pending" || listing.status === "flagged") && (
              <Button
                onClick={() => setApproveDialogOpen(true)}
                className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs rounded-lg gap-2 cursor-pointer shadow-xs"
              >
                <CheckCircle size={16} weight="bold" />
                <span>Approve Listing</span>
              </Button>
            )}

            {listing.status === "pending" && (
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(true)}
                className="w-full h-9 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg gap-1.5 cursor-pointer"
              >
                <XCircle size={15} />
                <span>Reject Listing</span>
              </Button>
            )}

            {(listing.status === "active" || listing.status === "flagged") && (
              <Button
                variant="ghost"
                onClick={() => setRemoveDialogOpen(true)}
                className="w-full h-9 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg gap-1.5 cursor-pointer"
              >
                <Trash size={15} />
                <span>Remove Listing</span>
              </Button>
            )}

            {isPublic && (
              <Button
                variant="outline"
                render={
                  <Link
                    href={`/listing/${listing.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                className="w-full h-9 text-xs font-semibold rounded-lg gap-1.5 cursor-pointer"
              >
                <ArrowSquareOut size={15} />
                <span>View Public Marketplace Listing</span>
              </Button>
            )}
          </div>

          {listing.status === "active" && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle size={16} className="shrink-0 mt-0.5" weight="fill" />
              <p className="leading-relaxed">
                This listing is active and published across the marketplace search index.
              </p>
            </div>
          )}

          {listing.status === "rejected" && listing.rejectionReason && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
              <div className="flex items-center gap-1 font-bold">
                <WarningCircle size={14} weight="fill" />
                <span>Rejection Reason:</span>
              </div>
              <p className="font-semibold">{listing.rejectionReason}</p>
              {listing.rejectionNote && (
                <p className="text-[11px] text-destructive/80">&ldquo;{listing.rejectionNote}&rdquo;</p>
              )}
            </div>
          )}

          {listing.status === "removed" && listing.removalReason && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
              <div className="flex items-center gap-1 font-bold">
                <Trash size={14} weight="bold" />
                <span>Takedown Reason:</span>
              </div>
              <p className="font-semibold">{listing.removalReason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ApproveListingDialog
        listing={listing}
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
      />

      <RejectListingDialog
        listing={listing}
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
      />

      <RemoveListingDialog
        listing={listing}
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
      />
    </>
  )
}
