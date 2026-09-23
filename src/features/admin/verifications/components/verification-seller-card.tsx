import Link from "next/link"
import {
  ArrowSquareOut,
  MapPin,
  CalendarBlank,
  ListBullets,
  EnvelopeSimple,
  Phone,
  IdentificationBadge,
  Buildings,
} from "@phosphor-icons/react/dist/ssr"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type {
  VerificationSellerSummary,
  VerificationIdentityDetails,
  VerificationBusinessDetails,
} from "../types"

interface VerificationSellerCardProps {
  seller: VerificationSellerSummary
  identityDetails?: VerificationIdentityDetails
  businessDetails?: VerificationBusinessDetails
}

export function VerificationSellerCard({
  seller,
  identityDetails,
  businessDetails,
}: VerificationSellerCardProps) {
  return (
    <Card className="rounded-xl bg-card p-0 shadow-2xs overflow-hidden space-y-0 border-0">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-sm sm:text-base font-bold text-foreground">
          Seller Information
        </CardTitle>
        {seller.slug && (
          <Link
            href={`/seller/${seller.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>View Public Profile</span>
            <ArrowSquareOut size={13} />
          </Link>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
          <Avatar className="size-14 rounded-full border border-border/70 shrink-0">
            <AvatarImage src={seller.avatar} alt={seller.name} />
            <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
              {seller.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-foreground">{seller.name}</h3>
              <Badge variant="secondary" className="text-[10px] font-semibold uppercase px-2 h-5">
                {seller.sellerType} Account
              </Badge>
            </div>

            <div className="flex items-center gap-3.5 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-muted-foreground/70 shrink-0" />
                <span>{seller.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarBlank size={14} className="text-muted-foreground/70 shrink-0" />
                <span>Joined {seller.joinedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <ListBullets size={14} className="text-muted-foreground/70 shrink-0" />
                <span>{seller.activeListings} active listings</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60 text-xs">
          <div className="space-y-1 p-2.5 rounded-lg bg-muted/30">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Phone size={12} />
              <span>Contact Phone</span>
            </span>
            <p className="font-semibold text-foreground font-mono">{seller.phone}</p>
          </div>

          <div className="space-y-1 p-2.5 rounded-lg bg-muted/30">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <EnvelopeSimple size={12} />
              <span>Email Address</span>
            </span>
            <p className="font-semibold text-foreground truncate">{seller.email}</p>
          </div>
        </div>

        {identityDetails && (
          <div className="space-y-2.5 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <IdentificationBadge size={16} className="text-primary" />
              <span>Submitted Identity Details</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-medium text-muted-foreground block">Full Legal Name</span>
                <span className="font-semibold text-foreground block">{identityDetails.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-muted-foreground block">ID / Passport Type</span>
                <span className="font-semibold text-foreground block">{identityDetails.idType}</span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-muted-foreground block">ID Number</span>
                <span className="font-semibold font-mono text-foreground block">{identityDetails.idNumber}</span>
              </div>
              {identityDetails.dob && (
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground block">Date of Birth</span>
                  <span className="text-foreground block">{identityDetails.dob}</span>
                </div>
              )}
              {identityDetails.nationality && (
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground block">Nationality</span>
                  <span className="text-foreground block">{identityDetails.nationality}</span>
                </div>
              )}
              {identityDetails.expiryDate && (
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground block">Expiry Date</span>
                  <span className="text-foreground block">{identityDetails.expiryDate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {businessDetails && (
          <div className="space-y-2.5 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Buildings size={16} className="text-blue-600 dark:text-blue-400" />
              <span>Business Information</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-medium text-muted-foreground block">Registered Business Name</span>
                <span className="font-semibold text-foreground block">{businessDetails.businessName}</span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-muted-foreground block">MOC Registration #</span>
                <span className="font-semibold font-mono text-foreground block">{businessDetails.registrationNumber}</span>
              </div>
              {businessDetails.taxNumber && (
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground block">GDT Tax ID</span>
                  <span className="font-semibold font-mono text-foreground block">{businessDetails.taxNumber}</span>
                </div>
              )}
              <div>
                <span className="text-[10px] font-medium text-muted-foreground block">Owner / Representative</span>
                <span className="font-semibold text-foreground block">{businessDetails.ownerName}</span>
              </div>
              {businessDetails.businessCategory && (
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground block">Business Scope</span>
                  <span className="text-foreground block">{businessDetails.businessCategory}</span>
                </div>
              )}
              <div className="col-span-2 sm:col-span-3">
                <span className="text-[10px] font-medium text-muted-foreground block">Registered Office Address</span>
                <span className="text-foreground block">{businessDetails.registeredAddress}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
