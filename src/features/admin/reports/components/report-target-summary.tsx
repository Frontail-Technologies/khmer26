import Link from "next/link"
import Image from "next/image"
import {
  Tag,
  Storefront,
  User,
  ChatCircle,
  ArrowSquareOut,
  SealCheck,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AdminReportTargetReference } from "../types"

interface ReportTargetSummaryProps {
  target: AdminReportTargetReference
}

export function ReportTargetSummary({ target }: ReportTargetSummaryProps) {
  return (
    <Card className="rounded-xl bg-card p-0 shadow-2xs overflow-hidden border-0">
      <CardHeader className="p-3.5 sm:p-4 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-6.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {target.type === "listing" && <Tag size={14} weight="bold" />}
            {target.type === "seller" && <Storefront size={14} weight="bold" />}
            {target.type === "user" && <User size={14} weight="bold" />}
            {target.type === "chat" && <ChatCircle size={14} weight="bold" />}
          </div>
          <div>
            <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
              Reported Target Entity
            </CardTitle>
            <p className="text-[10px] text-muted-foreground capitalize">
              Target Type: {target.type}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs font-semibold gap-1.5 rounded-lg"
          render={
            <Link href={target.href}>
              <span>
                {target.type === "listing"
                  ? "Open Listing Review"
                  : target.type === "chat"
                  ? "Open Reported Chat"
                  : "Open User Details"}
              </span>
              <ArrowSquareOut size={13} weight="bold" />
            </Link>
          }
        />
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4 space-y-4">
        {target.type === "listing" && (
          <div className="flex flex-col sm:flex-row items-start gap-3.5">
            <div className="relative size-20 sm:size-24 rounded-xl overflow-hidden border border-border/70 bg-muted/40 shrink-0">
              {target.thumbnail ? (
                <Image
                  src={target.thumbnail}
                  alt={target.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="size-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                  NO IMG
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {target.id}
                  </span>
                  {target.status && (
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">
                      {target.status}
                    </Badge>
                  )}
                  {target.reportCount && target.reportCount > 1 && (
                    <Badge variant="destructive" className="text-[10px] font-bold gap-1">
                      <WarningCircle size={11} weight="fill" />
                      <span>{target.reportCount} Reports on this item</span>
                    </Badge>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {target.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Price</span>
                  <span className="font-mono font-bold text-foreground">
                    {target.price
                      ? target.currency === "USD"
                        ? `$${target.price.toLocaleString("en-US")}`
                        : `${target.price.toLocaleString("en-US")} KHR`
                      : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Seller</span>
                  <span className="font-medium text-foreground truncate block">
                    {target.sellerName || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Category</span>
                  <span className="font-medium text-foreground truncate block">
                    {target.category || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(target.type === "seller" || target.type === "user") && (
          <div className="flex flex-col sm:flex-row items-start gap-3.5">
            <div className="relative size-16 sm:size-18 rounded-full overflow-hidden border border-border/70 bg-muted/40 shrink-0">
              {target.thumbnail ? (
                <Image
                  src={target.thumbnail}
                  alt={target.title}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              ) : (
                <div className="size-full flex items-center justify-center text-muted-foreground">
                  <User size={24} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {target.id}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold capitalize">
                    {target.sellerType || "User Account"}
                  </Badge>
                  {target.verified && (
                    <Badge variant="secondary" className="text-[10px] font-bold text-primary gap-1">
                      <SealCheck size={12} weight="fill" />
                      <span>Verified</span>
                    </Badge>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {target.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Member Since</span>
                  <span className="font-medium text-foreground">
                    {target.joinedDate || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Account Status</span>
                  <span className="font-medium text-foreground capitalize">
                    {target.status || "Active"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Active Reports</span>
                  <span className="font-mono font-bold text-destructive">
                    {target.reportCount || 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {target.type === "chat" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-border/50">
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-bold text-foreground">
                  {target.id}
                </span>
                <p className="text-xs font-semibold text-foreground">{target.title}</p>
                {target.subtitle && (
                  <p className="text-[11px] text-muted-foreground">{target.subtitle}</p>
                )}
              </div>
              <Badge variant="outline" className="text-[10px] font-bold">
                Reported Chat Evidence
              </Badge>
            </div>

            {target.participants && target.participants.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Conversation Participants
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  {target.participants.map((p, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 border border-border/60 text-xs"
                    >
                      <User size={13} className="text-muted-foreground" />
                      <span className="font-semibold text-foreground">{p.name}</span>
                      {p.role && (
                        <span className="text-[10px] text-muted-foreground">({p.role})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {target.snippet && (
              <div className="bg-muted/30 border border-border/60 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Reported Message Snippet
                </span>
                <p className="text-xs text-foreground font-mono leading-relaxed">
                  &ldquo;{target.snippet}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
