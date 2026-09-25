"use client"

import { useState, useMemo } from "react"
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
  Eye,
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
import { createPaymentColumns } from "../columns"
import { PaymentDetailSheet } from "./payment-detail-sheet"
import type { AdminPaymentTransaction } from "../types"

interface PaymentTableProps {
  initialPayments: AdminPaymentTransaction[]
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "successful", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
]

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  successful: { label: "Successful", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "destructive" },
}

export function PaymentTable({ initialPayments }: PaymentTableProps) {
  const [purposeTab, setPurposeTab] = useState<string>("all")
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTx, setSelectedTx] = useState<AdminPaymentTransaction | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleViewDetails = (tx: AdminPaymentTransaction) => {
    setSelectedTx(tx)
    setSheetOpen(true)
  }

  const columns = useMemo(() => {
    return createPaymentColumns({ onViewDetails: handleViewDetails })
  }, [])

  const filteredData = useMemo(() => {
    return initialPayments.filter((tx) => {
      if (purposeTab !== "all" && tx.purpose !== purposeTab) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesId = tx.id.toLowerCase().includes(q)
        const matchesRef = tx.transactionReference.toLowerCase().includes(q)
        const matchesPayer = tx.payerName.toLowerCase().includes(q)
        const matchesPayerId = tx.payerId.toLowerCase().includes(q)
        const matchesPhone = tx.payerPhone.toLowerCase().includes(q)
        const matchesPurpose = tx.purposeTitle.toLowerCase().includes(q)
        if (!matchesId && !matchesRef && !matchesPayer && !matchesPayerId && !matchesPhone && !matchesPurpose) {
          return false
        }
      }

      if (statusFilter !== "all" && tx.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [initialPayments, purposeTab, searchQuery, statusFilter])

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

  const hasActiveFilters = Boolean(searchQuery) || statusFilter !== "all"

  const handleReset = () => {
    setSearchQuery("")
    setStatusFilter("all")
  }

  const subCount = useMemo(() => initialPayments.filter((p) => p.purpose === "subscription").length, [initialPayments])
  const promoCount = useMemo(() => initialPayments.filter((p) => p.purpose === "promotion").length, [initialPayments])

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <div className="p-3 sm:p-4 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Tabs value={purposeTab} onValueChange={setPurposeTab} className="w-full sm:w-auto">
            <TabsList className="h-9 bg-muted/70 p-1 w-full sm:w-auto grid grid-cols-3">
              <TabsTrigger value="all" className="text-xs px-3">
                All ({initialPayments.length})
              </TabsTrigger>
              <TabsTrigger value="subscription" className="text-xs px-3">
                Subscriptions ({subCount})
              </TabsTrigger>
              <TabsTrigger value="promotion" className="text-xs px-3">
                Promotions ({promoCount})
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
                placeholder="Search payment ID, reference, or payer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <Select
              value={statusFilter}
              items={STATUS_OPTIONS}
              onValueChange={(val) => setStatusFilter(val ?? "all")}
            >
              <SelectTrigger className="h-9 text-xs w-[130px] shrink-0">
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
                  title="No payment transactions found"
                  description="Try adjusting your search criteria or active filters."
                />
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden divide-y divide-border/60">
          {filteredData.length ? (
            filteredData.map((tx) => {
              const statusConf = STATUS_CONFIG[tx.status] || {
                label: tx.status,
                tone: "neutral" as StatusTone,
              }

              return (
                <div
                  key={tx.id}
                  onClick={() => handleViewDetails(tx)}
                  className="p-3.5 space-y-2.5 hover:bg-muted/25 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-xs text-foreground block">
                        {tx.id}
                      </span>
                      <span className="text-[11px] font-semibold text-foreground block">
                        {tx.payerName}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground block">
                        {tx.transactionReference}
                      </span>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="font-bold text-xs text-foreground block">
                        ${tx.amount.toLocaleString()} {tx.currency}
                      </span>
                      <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Badge
                        variant={tx.purpose === "subscription" ? "default" : "secondary"}
                        className="text-[9px] uppercase font-bold px-1.5 py-0 h-4 shrink-0"
                      >
                        {tx.purpose}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground truncate">
                        {tx.purposeTitle}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {tx.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center justify-end pt-1 border-t border-border/40" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleViewDetails(tx)}
                      className="text-xs"
                    >
                      <Eye size={12} className="mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <DataTableEmpty
              colSpan={1}
              title="No payment transactions found"
              description="Try adjusting your search criteria or active filters."
            />
          )}
        </div>

        <div className="p-3 sm:p-4 border-t border-border/60 bg-muted/10">
          <DataTablePagination table={table} />
        </div>
      </div>

      <PaymentDetailSheet
        transaction={selectedTx}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
