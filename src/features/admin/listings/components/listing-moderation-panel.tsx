"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CheckCircle,
  XCircle,
  Trash,
  User,
  ArrowSquareOut,
  Flag,
  WarningCircle,
  ArrowClockwise,
  PencilSimple,
} from "@phosphor-icons/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  useRestoreListing,
  useDeleteListing,
  useUpdateListing,
} from "../hooks/listings.mutations"
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
  { value: "Dara Sok", label: "Dara Sok - Super Admin" },
  { value: "Channary Meas", label: "Channary Meas - Moderator" },
  { value: "Vannak Lim", label: "Vannak Lim - Moderator" },
]

export function ListingModerationPanel({ listing }: ListingModerationPanelProps) {
  const router = useRouter()
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [assignedAdmin, setAssignedAdmin] = useState(listing.assignedTo || "unassigned")

  // Edit fields
  const [editTitle, setEditTitle] = useState(listing.title)
  const [editPrice, setEditPrice] = useState(String(listing.price || ""))
  const [editCurrency, setEditCurrency] = useState<'USD' | 'KHR'>(listing.currency || 'USD')
  const [editDescription, setEditDescription] = useState(listing.description || "")

  const restoreMutation = useRestoreListing()
  const deleteMutation = useDeleteListing()
  const updateMutation = useUpdateListing()

  const isPublic = listing.status === "active" && Boolean(listing.slug)

  const handleRestore = async () => {
    await restoreMutation.mutateAsync(listing.id)
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(listing.id)
    setDeleteDialogOpen(false)
    router.push("/admin/listings")
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync({
      id: listing.id,
      data: {
        title: editTitle.trim(),
        price: editPrice ? Number(editPrice) : null,
        currency: editCurrency,
        description: editDescription.trim(),
      },
    })
    setEditDialogOpen(false)
  }

  return (
    <>
      <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden space-y-0 lg:sticky lg:top-20">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60 flex flex-row items-center justify-between">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Moderation Decision
          </CardTitle>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              setEditTitle(listing.title)
              setEditPrice(String(listing.price || ""))
              setEditCurrency(listing.currency || 'USD')
              setEditDescription(listing.description || "")
              setEditDialogOpen(true)
            }}
            className="text-xs h-7 gap-1 font-semibold text-muted-foreground hover:text-foreground"
          >
            <PencilSimple size={13} />
            <span>Edit</span>
          </Button>
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
                      ? "text-primary"
                      : listing.riskLevel === "medium"
                      ? "text-accent"
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

            {(listing.status === "rejected" || listing.status === "removed") && (
              <Button
                variant="outline"
                disabled={restoreMutation.isPending}
                onClick={() => void handleRestore()}
                className="w-full h-9 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg gap-1.5 cursor-pointer"
              >
                <ArrowClockwise size={15} className={restoreMutation.isPending ? "animate-spin" : ""} />
                <span>{restoreMutation.isPending ? "Restoring..." : "Restore Listing"}</span>
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

            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(true)}
              className="w-full h-9 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-lg gap-1.5 cursor-pointer"
            >
              <Trash size={14} />
              <span>Delete Permanently</span>
            </Button>

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
            <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-success text-xs flex items-start gap-2">
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive">
              Delete Listing Permanently
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to permanently delete &ldquo;{listing.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={() => void handleDelete()}
              className="text-xs font-semibold"
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Edit Listing Information
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update listing title, price, currency, or description.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Price</FieldLabel>
                <Input
                  type="number"
                  step="any"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="0.00"
                  className="h-9 text-xs"
                />
              </Field>
              <Field>
                <FieldLabel>Currency</FieldLabel>
                <Select
                  value={editCurrency}
                  onValueChange={(val) => setEditCurrency((val as 'USD' | 'KHR') || 'USD')}
                  items={[
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'KHR', label: 'KHR (៛)' },
                  ]}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD" className="text-xs">USD ($)</SelectItem>
                    <SelectItem value="KHR" className="text-xs">KHR (៛)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="text-xs resize-none"
              />
            </Field>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={updateMutation.isPending || !editTitle.trim()}
                className="text-xs font-semibold"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

