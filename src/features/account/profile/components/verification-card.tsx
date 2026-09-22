"use client"

import { useState } from "react"
import {
  CheckCircle,
  XCircle,
  ShieldCheck,
  IdentificationCard,
  EnvelopeSimple,
  Phone,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { AccountProfileData } from "../../types"

interface VerificationCardProps {
  profile: AccountProfileData
}

export function VerificationCard({ profile }: VerificationCardProps) {
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)

  return (
    <>
      <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
        <CardHeader className="p-0 pb-3">
          <div className="flex items-center gap-1.5 text-primary">
            <ShieldCheck size={18} weight="fill" />
            <CardTitle className="text-sm sm:text-base font-bold text-foreground">
              Account Verification
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Verified accounts receive higher buyer trust and priority placement.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-border/60">
          <div className="py-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <EnvelopeSimple size={16} className="text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-foreground block truncate">
                  Email
                </span>
                <span className="text-[11px] text-muted-foreground block truncate">
                  {profile.email}
                </span>
              </div>
            </div>

            {profile.emailVerified ? (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold shrink-0 gap-1 px-2 py-0.5"
              >
                <CheckCircle size={12} weight="fill" />
                <span>Verified</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-muted-foreground border-border text-[10px] font-semibold shrink-0 gap-1 px-2 py-0.5"
              >
                <XCircle size={12} />
                <span>Unverified</span>
              </Badge>
            )}
          </div>

          <div className="py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Phone size={16} className="text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-foreground block truncate">
                  Phone
                </span>
                <span className="text-[11px] text-muted-foreground block truncate">
                  {profile.phone}
                </span>
              </div>
            </div>

            {profile.phoneVerified ? (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold shrink-0 gap-1 px-2 py-0.5"
              >
                <CheckCircle size={12} weight="fill" />
                <span>Verified</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-muted-foreground border-border text-[10px] font-semibold shrink-0 gap-1 px-2 py-0.5"
              >
                <XCircle size={12} />
                <span>Unverified</span>
              </Badge>
            )}
          </div>

          <div className="py-2.5 last:pb-0 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <IdentificationCard size={16} className="text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-foreground block truncate">
                  National ID / Passport
                </span>
                <span className="text-[11px] text-muted-foreground block truncate">
                  {profile.identityVerified ? "Completed" : "Not verified"}
                </span>
              </div>
            </div>

            {profile.identityVerified ? (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold shrink-0 gap-1 px-2 py-0.5"
              >
                <CheckCircle size={12} weight="fill" />
                <span>Verified</span>
              </Badge>
            ) : (
              <Button
                type="button"
                size="xs"
                onClick={() => setVerifyDialogOpen(true)}
                className="h-7 px-2.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-2xs shrink-0"
              >
                Verify
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
              <IdentificationCard size={22} weight="bold" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Identity Verification
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Government ID verification will be available following official identity portal release.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3.5 rounded-xl bg-muted/50 border border-border/70 text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Why verify?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Receive official Blue Verified badge on listings</li>
              <li>Increase trust and sale completion rates by 40%</li>
              <li>Unlock higher listing limits and featured promotions</li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setVerifyDialogOpen(false)}
              className="text-xs font-semibold h-10 w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
