"use client"

import { useState } from "react"
import Link from "next/link"
import {
  User,
  Storefront,
  Star,
  WarningOctagon,
  ClockCounterClockwise,
  ArrowSquareOut,
  Lock,
  ShieldWarning,
  CheckCircle,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { UserActionDialogs } from "./user-action-dialogs"
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

export function UserDetailsPanel({ user }: UserDetailsPanelProps) {
  const [activeDialog, setActiveDialog] = useState<"restrict" | "suspend" | "restore" | null>(null)

  const accountStatusConf = STATUS_CONFIG[user.status] || { label: user.status, tone: "neutral" as StatusTone }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-8 space-y-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-5 h-9 bg-muted/60 p-1">
              <TabsTrigger value="overview" className="text-xs">
                Profile
              </TabsTrigger>
              <TabsTrigger value="listings" className="text-xs">
                Listings ({user.activeListingsCount})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs">
                Reviews ({user.reviewsCount ?? 0})
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-xs">
                Reports ({user.reportsCount})
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs">
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 pt-3">
              <Card className="bg-card border-0 shadow-2xs rounded-xl">
                <CardHeader className="py-3 px-4 border-b border-border/60">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User size={14} />
                    Account & Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Full Name</span>
                      <span className="font-semibold text-foreground">{user.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Primary Email</span>
                      <span className="font-semibold text-foreground">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Phone Number</span>
                      <span className="font-semibold text-foreground">{user.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Location / Province</span>
                      <span className="font-semibold text-foreground">{user.location}</span>
                    </div>
                    {user.nationalIdMasked && (
                      <div>
                        <span className="text-muted-foreground block text-[11px]">National ID (Verified)</span>
                        <span className="font-mono font-semibold text-foreground">{user.nationalIdMasked}</span>
                      </div>
                    )}
                    {user.registeredBusinessNumber && (
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Business Reg. Number</span>
                        <span className="font-mono font-semibold text-foreground">{user.registeredBusinessNumber}</span>
                      </div>
                    )}
                  </div>

                  {user.bio && (
                    <div className="pt-2 border-t border-border/40">
                      <span className="text-muted-foreground block text-[11px] mb-1">About / Bio</span>
                      <p className="text-foreground leading-relaxed bg-muted/30 p-2.5 rounded-md border border-border/40">
                        {user.bio}
                      </p>
                    </div>
                  )}

                  {user.address && (
                    <div className="pt-2 border-t border-border/40">
                      <span className="text-muted-foreground block text-[11px] mb-1">Registered Address</span>
                      <p className="text-foreground leading-relaxed">{user.address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {user.businessName && (
                <Card className="bg-card border-0 shadow-2xs rounded-xl">
                  <CardHeader className="py-3 px-4 border-b border-border/60">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Storefront size={14} />
                      Business & Merchant Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Business Entity Name</span>
                        <span className="font-semibold text-foreground">{user.businessName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Estimated Marketplace Volume</span>
                        <span className="font-semibold text-foreground">{user.totalSalesVolume ?? "N/A"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="listings" className="pt-3">
              <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden">
                <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Active Listings
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="xs"
                    render={
                      <Link href={`/admin/listings?search=${encodeURIComponent(user.name)}`}>
                        <ArrowSquareOut size={12} className="mr-1" />
                        All Listings
                      </Link>
                    }
                  />
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border/60">
                  {user.recentListings.length > 0 ? (
                    user.recentListings.map((listing) => {
                      const listConf = STATUS_CONFIG[listing.status] || { label: listing.status, tone: "neutral" as StatusTone }
                      return (
                        <div key={listing.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                          <div className="space-y-1 min-w-0">
                            <Link
                              href={`/admin/listings/${listing.id}`}
                              className="font-semibold text-foreground hover:text-primary transition-colors block truncate"
                            >
                              {listing.title}
                            </Link>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span>{listing.category}</span>
                              <span>•</span>
                              <span>${listing.price.toLocaleString()}</span>
                              <span>•</span>
                              <span>{listing.createdAt}</span>
                            </div>
                          </div>
                          <StatusBadge label={listConf.label} tone={listConf.tone} size="sm" />
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      No active listings found for this account.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="pt-3">
              <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden">
                <CardHeader className="py-3 px-4 border-b border-border/60">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Star size={14} />
                    Customer Reviews & Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border/60">
                  {user.recentReviews.length > 0 ? (
                    user.recentReviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{rev.authorName}</span>
                            <div className="flex items-center text-amber-500 font-semibold text-[11px]">
                              <Star size={12} weight="fill" className="mr-0.5" />
                              {rev.rating}.0
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{rev.createdAt}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      No reviews recorded for this seller yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="pt-3">
              <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden">
                <CardHeader className="py-3 px-4 border-b border-border/60">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <WarningOctagon size={14} />
                    Community Reports Filed Against User
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border/60">
                  {user.relatedReports.length > 0 ? (
                    user.relatedReports.map((rep) => {
                      const repConf = STATUS_CONFIG[rep.status] || { label: rep.status, tone: "neutral" as StatusTone }
                      return (
                        <div key={rep.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-foreground">{rep.id}</span>
                              <Badge variant="outline" className="text-[10px] font-medium">
                                By {rep.reporterName}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground truncate">{rep.reason}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StatusBadge label={repConf.label} tone={repConf.tone} size="sm" />
                            <Button
                              variant="ghost"
                              size="xs"
                              render={
                                <Link href={`/admin/reports/${rep.id}`}>
                                  <ArrowSquareOut size={13} />
                                </Link>
                              }
                            />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      No active moderation reports filed against this user.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="pt-3">
              <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden">
                <CardHeader className="py-3 px-4 border-b border-border/60">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ClockCounterClockwise size={14} />
                    Account Moderation & Audit History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {user.accountHistory.map((item) => (
                      <div key={item.id} className="flex gap-3 text-xs">
                        <div className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{item.action}</span>
                            <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground block">
                            Logged by: <span className="text-foreground">{item.actor}</span>
                          </span>
                          {item.note && (
                            <p className="text-[11px] text-muted-foreground/90 bg-muted/40 p-2 rounded mt-1 border border-border/40">
                              {item.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-border/60">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Account Status</span>
                <StatusBadge label={accountStatusConf.label} tone={accountStatusConf.tone} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Joined Date</span>
                <span className="font-semibold text-foreground">{user.joinedAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Active</span>
                <span className="font-semibold text-foreground">{user.lastActiveAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Listings</span>
                <span className="font-semibold text-foreground">{user.activeListingsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sold Items</span>
                <span className="font-semibold text-foreground">{user.soldListingsCount}</span>
              </div>
              {user.rating && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Seller Rating</span>
                  <span className="font-semibold text-amber-500 flex items-center gap-1">
                    <Star size={12} weight="fill" />
                    {user.rating} / 5.0
                  </span>
                </div>
              )}
              {user.assignedModerator && (
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="text-muted-foreground">Assigned Moderator</span>
                  <span className="font-semibold text-foreground">{user.assignedModerator}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-border/60">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Moderation Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs justify-start"
                onClick={() => setActiveDialog("restrict")}
              >
                <Lock size={14} className="mr-2 text-amber-500" />
                Restrict Account
              </Button>

              {user.status === "suspended" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-start text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                  onClick={() => setActiveDialog("restore")}
                >
                  <CheckCircle size={14} className="mr-2 text-emerald-500" />
                  Restore Account
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-start text-destructive hover:text-destructive"
                  onClick={() => setActiveDialog("suspend")}
                >
                  <ShieldWarning size={14} className="mr-2 text-destructive" />
                  Suspend Account
                </Button>
              )}

              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs justify-start"
                render={
                  <Link href={`/admin/reports?search=${encodeURIComponent(user.name)}`}>
                    <WarningOctagon size={14} className="mr-2" />
                    Open Related Reports
                  </Link>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <UserActionDialogs
        user={user}
        actionType={activeDialog}
        onClose={() => setActiveDialog(null)}
      />
    </>
  )
}
