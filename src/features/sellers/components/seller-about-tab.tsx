import {
  ShieldCheck,
  MapPin,
  CalendarBlank,
  Clock,
  Translate,
  Medal,
  Info,
  Globe,
} from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SellerProfileDetail } from "../types"

interface SellerAboutTabProps {
  seller: SellerProfileDetail
}

export function SellerAboutTab({ seller }: SellerAboutTabProps) {
  const details = [
    {
      label: "Account Type",
      value: seller.sellerType,
      icon: <Medal size={16} className="text-primary shrink-0" />,
    },
    {
      label: "Location",
      value: seller.location,
      icon: <MapPin size={16} className="text-primary shrink-0" />,
    },
    {
      label: "Member Since",
      value: seller.joinedAt,
      icon: <CalendarBlank size={16} className="text-primary shrink-0" />,
    },
    {
      label: "Verification",
      value: seller.verified ? "Verified Identity & Business" : "Unverified",
      icon: <ShieldCheck size={16} className="text-primary shrink-0" />,
    },
    {
      label: "Response Speed",
      value: seller.responseTime ? `Usually ${seller.responseTime}` : "Within 24 hours",
      icon: <Clock size={16} className="text-primary shrink-0" />,
    },
    {
      label: "Languages",
      value: seller.languages ? seller.languages.join(", ") : "Khmer, English",
      icon: <Translate size={16} className="text-primary shrink-0" />,
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs">
        <CardHeader className="p-0 pb-4 flex flex-row items-center gap-2">
          <Info size={18} className="text-primary shrink-0" />
          <CardTitle className="text-base sm:text-lg font-bold text-foreground">
            About {seller.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 space-y-5">
          {seller.bio && (
            <div className="space-y-2 text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
              <p>{seller.bio}</p>
            </div>
          )}

          {seller.badges && seller.badges.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-xs font-semibold text-muted-foreground block">
                Trust & Accreditations
              </span>
              <div className="flex flex-wrap gap-1.5">
                {seller.badges.map((badge, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs font-medium border-primary/30 text-foreground bg-primary/5 px-2.5 py-1"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {seller.website && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/60">
              <Globe size={16} className="text-primary shrink-0" />
              <span>Website: </span>
              <a
                href={seller.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                {seller.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base sm:text-lg font-bold text-foreground">
            Seller Overview & Details
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {details.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-muted-foreground font-medium block">
                    {item.label}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
