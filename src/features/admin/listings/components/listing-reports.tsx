import { Flag, CheckCircle, Warning } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AdminListingReport } from "../types"

interface ListingReportsProps {
  reports: AdminListingReport[]
}

export function ListingReports({ reports }: ListingReportsProps) {
  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden space-y-0">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <Flag size={18} className={reports.length > 0 ? "text-destructive" : "text-primary"} />
            <span>Community Flags & Reports</span>
          </CardTitle>
          {reports.length > 0 && (
            <Badge variant="destructive" className="text-[10px] font-bold px-1.5 h-4.5">
              {reports.length}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {reports.length === 0 ? (
          <div className="p-3.5 rounded-lg bg-muted/20 border border-border/50 text-xs text-muted-foreground flex items-center gap-2.5">
            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
            <span>No reports or community flags submitted for this listing.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-destructive flex items-center gap-1.5 text-xs">
                      <Warning size={14} weight="fill" />
                      <span>{report.reason}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      Reported by <span className="font-semibold text-foreground">{report.reporterName || "Anonymous User"}</span> ({report.reporterType}) on {report.submittedAt}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase font-bold shrink-0">
                    {report.status}
                  </Badge>
                </div>

                {report.notes && (
                  <p className="text-xs text-foreground/90 bg-card/60 p-2.5 rounded-lg border border-border/60 leading-relaxed">
                    &ldquo;{report.notes}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
