"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
} from "@tanstack/react-table"
import {
  MagnifyingGlass,
  ArrowCounterClockwise,
  Sparkle,
  Star,
  Lightning,
  Eye,
  ArrowSquareOut,
  StopCircle,
} from "@phosphor-icons/react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
  type SelectOption,
} from "@/components/ui/select"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { createPromotionColumns } from "../columns"
import { PromotionDetailSheet } from "./promotion-detail-sheet"
import type { ActivePromotionItem, PromotionType } from "../types"

interface PromotionTableProps {
  initialPromotions: ActivePromotionItem[]
}

const TYPE_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Types" },
  { value: "featured", label: "Featured Listing" },
  { value: "top_listing", label: "Top Listing Boost" },
  { value: "urgent", label: "Urgent Badge" },
]

const PROMOTION_TYPE_CONFIG: Record<
  PromotionType,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  featured: {
    label: "Featured Listing",
    icon: Sparkle,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  top_listing: {
    label: "Top Listing Boost",
    icon: Star,
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  urgent: {
    label: "Urgent Badge",
    icon: Lightning,
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  expired: { label: "Expired", tone: "neutral" },
}

export function PromotionTable({ initialPromotions }: PromotionTableProps) {
  const [promotions, setPromotions] = useState<ActivePromotionItem[]>(initialPromotions)
  const [statusTab, setStatusTab] = useState<string>("all")
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startedAt", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedPromotion, setSelectedPromotion] = useState<ActivePromotionItem | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleViewDetails = (item: ActivePromotionItem) => {
    setSelectedPromotion(item)
    setSheetOpen(true)
  }

  const handleEndPromotion = (id: string) => {
    setPromotions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "expired" as const } : item
      )
    )
  }

  const columns = useMemo(() => {
    return createPromotionColumns({
      onViewDetails: handleViewDetails,
      onEndPromotion: handleEndPromotion,
    })
  }, [])

  const filteredData = useMemo(() => {
    return promotions.filter((item) => {
      if (statusTab !== "all" && item.status !== statusTab) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = item.listingTitle.toLowerCase().includes(q)
        const matchesSeller = item.sellerName.toLowerCase().includes(q)
        const matchesId = item.id.toLowerCase().includes(q)
        const matchesListingId = item.listingId.toLowerCase().includes(q)
        if (!matchesTitle && !matchesSeller && !matchesId && !matchesListingId) {
          return false
        }
      }

      if (typeFilter !== "all" && item.promotionType !== typeFilter) {
        return false
      }

      return true
    })
  }, [promotions, statusTab, searchQuery, typeFilter])

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

  const hasActiveFilters = Boolean(searchQuery) || typeFilter !== "all"

  const handleReset = () => {
    setSearchQuery("")
    setTypeFilter("all")
  }

  const activeCount = useMemo(() => promotions.filter((p) => p.status === "active").length, [promotions])
  const expiredCount = useMemo(() => promotions.filter((p) => p.status === "expired").length, [promotions])

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <div className="p-3 sm:p-4 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Tabs value={statusTab} onValueChange={setStatusTab} className="w-full sm:w-auto">
            <TabsList className="h-9 bg-muted/70 p-1 w-full sm:w-auto grid grid-cols-3">
              <TabsTrigger value="all" className="text-xs px-3">
                All ({promotions.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs px-3">
                Active ({activeCount})
              </TabsTrigger>
              <TabsTrigger value="expired" className="text-xs px-3">
                Expired ({expiredCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 flex-1 sm:justify-end">
            <div className="relative flex-1 sm:max-w-[280px]">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search listing, seller, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <Select
              value={typeFilter}
              items={TYPE_OPTIONS}
              onValueChange={(val) => setTypeFilter(val ?? "all")}
            >
              <SelectTrigger className="h-9 text-xs w-[140px] shrink-0">
                <SelectValue placeholder="All Types">
                  {(val) => getSelectOptionLabel(TYPE_OPTIONS, val, "All Types")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((opt) => (
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
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
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
                    className="transition-colors hover:bg-muted/25 border-b border-border/60 h-14 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4 text-xs">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <DataTableEmpty
                  colSpan={columns.length}
                  title="No promotions found"
                  description="Try adjusting your search query or status tab."
                />
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden divide-y divide-border/60">
          {filteredData.length ? (
            filteredData.map((item) => {
              const conf = PROMOTION_TYPE_CONFIG[item.promotionType] || PROMOTION_TYPE_CONFIG.featured
              const Icon = conf.icon
              const statusConf = STATUS_CONFIG[item.status] || {
                label: item.status,
                tone: "neutral" as StatusTone,
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleViewDetails(item)}
                  className="p-3.5 space-y-2.5 hover:bg-muted/25 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.listingImage && (
                        <div className="relative size-10 rounded-md overflow-hidden shrink-0 border border-border/60 bg-muted">
                          <Image
                            src={item.listingImage}
                            alt={item.listingTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-xs text-foreground block truncate">
                          {item.listingTitle}
                        </span>
                        <span className="text-[11px] text-muted-foreground block truncate">
                          {item.sellerName}
                        </span>
                      </div>
                    </div>
                    <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold px-2 py-0.5 h-5 flex items-center gap-1 ${conf.badgeClass}`}
                    >
                      <Icon size={12} weight="fill" />
                      <span>{conf.label}</span>
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      Expires: {item.expiresAt}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleViewDetails(item)}
                      className="text-xs"
                    >
                      <Eye size={12} className="mr-1" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      render={
                        <Link href={`/admin/listings/${item.listingId}`}>
                          <ArrowSquareOut size={12} className="mr-1" />
                          Listing
                        </Link>
                      }
                      className="text-xs"
                    />
                    {item.status === "active" && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleEndPromotion(item.id)}
                        className="text-xs text-destructive hover:bg-destructive/10"
                      >
                        <StopCircle size={12} className="mr-1" />
                        End
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <DataTableEmpty
              colSpan={1}
              title="No promotions found"
              description="Try adjusting your search query or status tab."
            />
          )}
        </div>

        <div className="p-3 sm:p-4 border-t border-border/60 bg-muted/10">
          <DataTablePagination table={table} />
        </div>
      </div>

      <PromotionDetailSheet
        promotion={selectedPromotion}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onEndPromotion={handleEndPromotion}
      />
    </div>
  )
}
