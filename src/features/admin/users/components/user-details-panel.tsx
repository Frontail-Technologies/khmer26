"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Star,
  WarningOctagon,
  ArrowSquareOut,
  ListBullets,
  ClockCounterClockwise,
  ArrowRight,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminUserDetail } from "../types"

interface UserDetailsPanelProps {
  user: AdminUserDetail
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  suspended: { label: "Suspended", tone: "destructive" },
  restricted: { label: "Restricted", tone: "warning" },
  resolved: { label: "Resolved", tone: "neutral" },
}

const VERIFICATION_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  verified: { label: "Verified", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  unverified: { label: "Unverified", tone: "neutral" },
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <span className="text-[11px] text-muted-foreground block mb-0.5">{label}</span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  )
}

export function UserDetailsPanel({ user }: UserDetailsPanelProps) {
  const [adminNote, setAdminNote] = useState("")
  const [isNoteSaved, setIsNoteSaved] = useState(false)
  const [isActive, setIsActive] = useState(user.status === "active")
  const [allowPosting, setAllowPosting] = useState(user.status === "active")

  const isSeller = user.accountType === "seller" || user.accountType === "business" || user.accountType === "dealer"
  const verifConf = VERIFICATION_CONFIG[user.verificationStatus] || { label: user.verificationStatus, tone: "neutral" as StatusTone }

  const handleSaveNote = () => {
    if (!adminNote.trim()) return
    setIsNoteSaved(true)
    setTimeout(() => setIsNoteSaved(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-8">
        <Card className="bg-card border-0 shadow-2xs rounded-xl p-5 space-y-6">
          <div>
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Full Name" value={user.name} />
              {user.businessName && <InfoRow label="Business Name" value={user.businessName} />}
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone" value={user.phone} />
              <InfoRow label="Location" value={user.location} />
              <InfoRow label="Province" value={user.province} />
              {user.address && <InfoRow label="Street Address" value={user.address} />}
              {user.nationalIdMasked && (
                <InfoRow label="National ID" value={user.nationalIdMasked} />
              )}
              {user.registeredBusinessNumber && (
                <InfoRow label="Business Reg. No." value={user.registeredBusinessNumber} />
              )}
            </div>
            {user.bio && (
              <div className="mt-4 pt-3 border-t border-border/40">
                <span className="text-[11px] text-muted-foreground block mb-1">Bio</span>
                <p className="text-xs text-foreground leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>

          {isSeller && (
            <>
              <Separator className="bg-border/60" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Marketplace
                  </h2>
                  <Button
                    variant="ghost"
                    size="xs"
                    render={
                      <Link
                        href={`/admin/listings?search=${encodeURIComponent(user.name)}`}
                        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <ArrowSquareOut size={12} />
                        View Listings
                      </Link>
                    }
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">Active Listings</span>
                    <span className="text-sm font-bold text-foreground">{user.activeListingsCount}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">Sold</span>
                    <span className="text-sm font-bold text-foreground">{user.soldListingsCount}</span>
                  </div>
                  {user.reviewsCount !== undefined && (
                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-0.5">Reviews</span>
                      <span className="text-sm font-bold text-foreground">{user.reviewsCount}</span>
                    </div>
                  )}
                  {user.rating && (
                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-0.5">Rating</span>
                      <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
                        <Star size={13} weight="fill" />
                        {user.rating}
                      </span>
                    </div>
                  )}
                </div>

                {user.recentListings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/40 space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                      <ListBullets size={12} />
                      Recent Listings
                    </span>
                    {user.recentListings.slice(0, 3).map((listing) => {
                      const conf = STATUS_CONFIG[listing.status] || { label: listing.status, tone: "neutral" as StatusTone }
                      return (
                        <Link
                          key={listing.id}
                          href={`/admin/listings/${listing.id}`}
                          className="flex items-center justify-between gap-3 py-1.5 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors group cursor-pointer border-b border-border/30 last:border-0"
                        >
                          <div className="min-w-0">
                            <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors block truncate">
                              {listing.title}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {listing.category} · ${listing.price.toLocaleString()}
                            </span>
                          </div>
                          <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {user.relatedReports.length > 0 && (
            <>
              <Separator className="bg-border/60" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <WarningOctagon size={13} className="text-amber-500" />
                    Reports ({user.relatedReports.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="xs"
                    render={
                      <Link
                        href={`/admin/reports?search=${encodeURIComponent(user.name)}`}
                        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <ArrowSquareOut size={12} />
                        Open in Reports
                      </Link>
                    }
                  />
                </div>
                <div className="divide-y divide-border/40 border border-border/40 rounded-lg overflow-hidden">
                  {user.relatedReports.map((rep) => {
                    const conf = STATUS_CONFIG[rep.status] || { label: rep.status, tone: "neutral" as StatusTone }
                    return (
                      <div key={rep.id} className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-muted/10">
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-foreground block">{rep.reason}</span>
                          <span className="text-[11px] text-muted-foreground">By {rep.reporterName} · {rep.createdAt}</span>
                        </div>
                        <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          <Separator className="bg-border/60" />

          <div>
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              Internal Notes
            </h2>
            <div className="space-y-3">
              <Textarea
                placeholder="Add internal moderator note for this account..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleSaveNote}
                  className="h-8 text-xs font-semibold cursor-pointer"
                  disabled={!adminNote.trim()}
                >
                  {isNoteSaved ? "Note Saved" : "Save Note"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-4">
        <Card className="bg-card border-0 shadow-2xs rounded-xl p-5 space-y-5">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Admin Controls
            </h2>

            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-foreground block">Active Account</span>
                <span className="text-[11px] text-muted-foreground">Allow login and access</span>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                aria-label="Toggle active account"
              />
            </div>

            {isSeller && (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-foreground block">Allow Posting</span>
                  <span className="text-[11px] text-muted-foreground">Can submit listings</span>
                </div>
                <Switch
                  checked={allowPosting}
                  onCheckedChange={setAllowPosting}
                  aria-label="Toggle allow posting"
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/40">
              <div>
                <span className="text-xs font-medium text-foreground block">Verification</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <StatusBadge label={verifConf.label} tone={verifConf.tone} size="sm" />
                </div>
              </div>
              <Button
                variant="ghost"
                size="xs"
                render={
                  <Link
                    href={`/admin/verifications?search=${encodeURIComponent(user.name)}`}
                    className="flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    <span>Review</span>
                    <ArrowRight size={11} />
                  </Link>
                }
              />
            </div>
          </div>

          <Separator className="bg-border/60" />

          <div className="space-y-2.5 text-xs">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              Account Summary
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge
                label={STATUS_CONFIG[user.status]?.label ?? user.status}
                tone={STATUS_CONFIG[user.status]?.tone ?? "neutral"}
                size="sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Joined</span>
              <span className="font-medium text-foreground">{user.joinedAt}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Active</span>
              <span className="font-medium text-foreground">{user.lastActiveAt}</span>
            </div>
            {isSeller && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Listings</span>
                <span className="font-medium text-foreground">{user.activeListingsCount}</span>
              </div>
            )}
            {user.reportsCount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reports</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">{user.reportsCount}</span>
              </div>
            )}
          </div>
        </Card>

        {user.accountHistory.length > 0 && (
          <div className="bg-card/60 rounded-xl p-4 space-y-3">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ClockCounterClockwise size={13} />
              Activity
            </h2>
            <div className="space-y-3">
              {user.accountHistory.map((item) => (
                <div key={item.id} className="flex gap-2.5 text-xs">
                  <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-xs font-medium text-foreground block">{item.action}</span>
                    <span className="text-[11px] text-muted-foreground block">
                      {item.actor} · {item.timestamp}
                    </span>
                    {item.note && (
                      <p className="text-[11px] text-muted-foreground bg-muted/40 px-2 py-1 rounded mt-1">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
