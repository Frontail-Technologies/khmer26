"use client"

import { useState, useMemo, useCallback } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table"
import {
  MagnifyingGlass,
  Star,
  ArrowCounterClockwise,
  EyeSlash,
  Eye,
  WarningCircle,
  DotsThreeVertical,
} from "@phosphor-icons/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
  type SelectOption,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { StatusBadge } from "@/components/shared/status-badge"
import { createReviewColumns } from "../columns"
import { ReviewDetailSheet } from "./review-detail-sheet"
import type { AdminReview } from "../types"
import { cn } from "@/lib/utils"

interface ReviewWorkspaceProps {
  initialReviews: AdminReview[]
}

type ReviewTabKey = "all" | "reported" | "hidden"

const RATING_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
]

export function ReviewWorkspace({ initialReviews }: ReviewWorkspaceProps) {
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews)
  const [activeTab, setActiveTab] = useState<ReviewTabKey>("all")
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [reviewToHide, setReviewToHide] = useState<AdminReview | null>(null)

  const handleViewDetails = useCallback((rev: AdminReview) => {
    setSelectedReview(rev)
    setSheetOpen(true)
  }, [])

  const handleRequestHide = useCallback((rev: AdminReview) => {
    setReviewToHide(rev)
  }, [])

  const handleConfirmHide = () => {
    if (!reviewToHide) return
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewToHide.id ? { ...r, status: "hidden" as const } : r
      )
    )
    if (selectedReview?.id === reviewToHide.id) {
      setSelectedReview((prev) => (prev ? { ...prev, status: "hidden" as const } : null))
    }
    setReviewToHide(null)
  }

  const handleRestore = useCallback((id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "visible" as const } : r))
    )
    if (selectedReview?.id === id) {
      setSelectedReview((prev) => (prev ? { ...prev, status: "visible" as const } : null))
    }
  }, [selectedReview?.id])

  const handleDismissReports = useCallback((id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reportsCount: 0, reportReasons: [] } : r))
    )
    if (selectedReview?.id === id) {
      setSelectedReview((prev) =>
        prev ? { ...prev, reportsCount: 0, reportReasons: [] } : null
      )
    }
  }, [selectedReview?.id])

  const counts = useMemo(() => {
    return {
      all: reviews.length,
      reported: reviews.filter((r) => r.reportsCount > 0).length,
      hidden: reviews.filter((r) => r.status === "hidden").length,
    }
  }, [reviews])

  const filteredData = useMemo(() => {
    return reviews.filter((item) => {
      if (activeTab === "reported" && item.reportsCount <= 0) {
        return false
      }
      if (activeTab === "hidden" && item.status !== "hidden") {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesComment = item.comment.toLowerCase().includes(q)
        const matchesReviewer = item.reviewer.name.toLowerCase().includes(q)
        const matchesReviewerId = item.reviewer.id.toLowerCase().includes(q)
        const matchesSeller = item.seller.name.toLowerCase().includes(q)
        const matchesSellerBiz = item.seller.businessName?.toLowerCase().includes(q) ?? false
        const matchesSellerId = item.seller.id.toLowerCase().includes(q)
        const matchesListing = item.listing?.title.toLowerCase().includes(q) ?? false
        const matchesId = item.id.toLowerCase().includes(q)

        if (
          !matchesComment &&
          !matchesReviewer &&
          !matchesReviewerId &&
          !matchesSeller &&
          !matchesSellerBiz &&
          !matchesSellerId &&
          !matchesListing &&
          !matchesId
        ) {
          return false
        }
      }

      if (ratingFilter !== "all" && item.rating !== Number.parseInt(ratingFilter, 10)) {
        return false
      }

      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [reviews, activeTab, searchQuery, ratingFilter, statusFilter])

  const columns = useMemo(() => {
    return createReviewColumns({
      onViewDetails: handleViewDetails,
      onRequestHide: handleRequestHide,
      onRestore: handleRestore,
    })
  }, [handleViewDetails, handleRequestHide, handleRestore])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const hasActiveFilters =
    Boolean(searchQuery) || ratingFilter !== "all" || statusFilter !== "all"

  const handleReset = () => {
    setSearchQuery("")
    setRatingFilter("all")
    setStatusFilter("all")
  }

  const tabs: { key: ReviewTabKey; label: string; count: number }[] = [
    { key: "all", label: "All Reviews", count: counts.all },
    { key: "reported", label: "Reported", count: counts.reported },
    { key: "hidden", label: "Hidden", count: counts.hidden },
  ]

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <div className="border-b border-border/60 bg-muted/20 px-3 sm:px-4 pt-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 border-transparent",
                    isActive
                      ? "bg-card text-foreground border-primary shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <span>{tab.label}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-1.5 py-0 h-4 text-[10px] font-bold rounded-md border",
                      isActive
                        ? "bg-muted text-foreground border-border"
                        : "bg-background/80 text-muted-foreground border-border/60"
                    )}
                  >
                    {tab.count}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-3 sm:p-4 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search review text, reviewer, seller, listing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Select
              value={ratingFilter}
              items={RATING_OPTIONS}
              onValueChange={(val) => setRatingFilter(val ?? "all")}
            >
              <SelectTrigger className="h-9 text-xs w-[120px] shrink-0">
                <SelectValue placeholder="All Ratings">
                  {(val) => getSelectOptionLabel(RATING_OPTIONS, val, "All Ratings")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {RATING_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              items={STATUS_OPTIONS}
              onValueChange={(val) => setStatusFilter(val ?? "all")}
            >
              <SelectTrigger className="h-9 text-xs w-[125px] shrink-0">
                <SelectValue placeholder="All Statuses">
                  {(val) => getSelectOptionLabel(STATUS_OPTIONS, val, "All Statuses")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowCounterClockwise size={14} className="mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto min-w-0">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-muted/60 dark:bg-muted/90 hover:bg-muted/60 dark:hover:bg-muted/90 border-b border-border/80 select-none"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleViewDetails(row.original)}
                    className="hover:bg-muted/40 transition-colors border-b border-border/50 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4 text-xs">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <DataTableEmpty
                  colSpan={columns.length}
                  title="No reviews found"
                  description="Try clearing search or filter parameters."
                />
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden divide-y divide-border/60">
          {filteredData.length ? (
            filteredData.map((rev) => (
              <div
                key={rev.id}
                onClick={() => handleViewDetails(rev)}
                className="p-3.5 space-y-2.5 hover:bg-muted/20 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        weight="fill"
                        className={i < rev.rating ? "text-amber-500" : "text-muted-foreground/25"}
                      />
                    ))}
                    <span className="font-bold text-xs text-foreground ml-1">
                      {rev.rating}.0
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <StatusBadge
                      label={rev.status === "visible" ? "Visible" : "Hidden"}
                      tone={rev.status === "visible" ? "success" : "neutral"}
                      size="sm"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="size-7 text-muted-foreground hover:text-foreground"
                            aria-label="Review actions"
                          >
                            <DotsThreeVertical size={16} weight="bold" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-40 text-xs">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(rev)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>Review Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {rev.status === "visible" ? (
                          <DropdownMenuItem
                            onClick={() => handleRequestHide(rev)}
                            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                          >
                            <EyeSlash size={13} />
                            <span>Hide Review</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleRestore(rev.id)}
                            className="flex items-center gap-2 cursor-pointer text-primary focus:text-primary"
                          >
                            <ArrowCounterClockwise size={13} />
                            <span>Restore Review</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
                  {rev.comment}
                </p>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <div className="space-y-0.5 truncate pr-2">
                    <span className="font-medium text-foreground block truncate">
                      {rev.reviewer.name} → {rev.seller.businessName || rev.seller.name}
                    </span>
                    {rev.listing && (
                      <span className="text-[10px] text-primary block truncate">
                        {rev.listing.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-right">
                    {rev.reportsCount > 0 && (
                      <Badge
                        variant="outline"
                        className="text-[9px] font-bold px-1 py-0 h-4 border-destructive/30 text-destructive bg-destructive/5"
                      >
                        <WarningCircle size={10} className="mr-0.5" weight="fill" />
                        {rev.reportsCount}
                      </Badge>
                    )}
                    <span className="text-[10px] whitespace-nowrap">{rev.createdAt.split(" ")[0]}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <DataTableEmpty
              colSpan={1}
              title="No reviews found"
              description="Try clearing search or filter parameters."
            />
          )}
        </div>

        <div className="border-t border-border/60">
          <DataTablePagination table={table} />
        </div>
      </div>

      <ReviewDetailSheet
        review={selectedReview}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onRequestHide={handleRequestHide}
        onRestore={handleRestore}
        onDismissReports={handleDismissReports}
      />

      <Dialog open={Boolean(reviewToHide)} onOpenChange={(open) => !open && setReviewToHide(null)}>
        <DialogContent className="sm:max-w-md p-5 rounded-xl bg-card border-0 shadow-lg">
          <DialogHeader className="space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-destructive font-semibold">
              <EyeSlash size={20} />
              <DialogTitle className="text-sm sm:text-base">
                Hide Review ({reviewToHide?.id})
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Are you sure you want to hide this review from public display on the seller profile and listing?
            </DialogDescription>
          </DialogHeader>

          {reviewToHide && (
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-xs text-foreground space-y-1 my-2">
              <div className="font-semibold text-[11px] text-muted-foreground">
                Review by {reviewToHide.reviewer.name} for {reviewToHide.seller.businessName || reviewToHide.seller.name}:
              </div>
              <p className="italic text-muted-foreground line-clamp-2">
                &quot;{reviewToHide.comment}&quot;
              </p>
            </div>
          )}

          <DialogFooter className="flex flex-row gap-2 pt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReviewToHide(null)}
              className="flex-1 sm:flex-initial h-9 px-4 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmHide}
              className="flex-1 sm:flex-initial h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
            >
              Hide Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
