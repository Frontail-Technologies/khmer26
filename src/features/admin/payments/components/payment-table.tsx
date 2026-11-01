"use client"

import { actionColumnClass } from "@/components/data-table/pinned-actions"

import { AdminFilterBar, AdminFilterSelect } from "@/components/admin/admin-filter-bar"

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
  Eye,
} from "@phosphor-icons/react"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SelectOption } from "@/components/ui/select"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { createPaymentColumns } from "../columns"
import { PaymentDetailSheet } from "./payment-detail-sheet"
import type { AdminPaymentTransaction } from "../types"
import { cn } from "@/lib/utils"
import { useAdminPayments } from "../hooks/payments.queries"

interface PaymentTableProps {
  initialPayments?: AdminPaymentTransaction[]
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

type PaymentTabKey = "all" | "subscription" | "promotion"

export function PaymentTable({ initialPayments = [] }: PaymentTableProps) {
  const { data } = useAdminPayments()
  const payments = data?.items ?? initialPayments
  const [activeTab, setActiveTab] = useState<PaymentTabKey>("all")
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

  const counts = useMemo(() => {
    return {
      all: payments.length,
      subscription: payments.filter((p) => p.purpose === "subscription").length,
      promotion: payments.filter((p) => p.purpose === "promotion").length,
    }
  }, [payments])

  const filteredData = useMemo(() => {
    return payments.filter((tx) => {
      if (activeTab !== "all" && tx.purpose !== activeTab) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesId =
          tx.displayId.toLowerCase().includes(q) || tx.id.toLowerCase().includes(q)
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
  }, [payments, activeTab, searchQuery, statusFilter])

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


  const handleReset = () => {
    setSearchQuery("")
    setStatusFilter("all")
  }

  const tabs: { key: PaymentTabKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "subscription", label: "Subscriptions", count: counts.subscription },
    { key: "promotion", label: "Promotions", count: counts.promotion },
  ]

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <Tabs
          value={activeTab}
          onValueChange={(val) => val && setActiveTab(val as PaymentTabKey)}
          className="border-b border-border/60 bg-muted/20 px-3 sm:px-4 pt-2.5 overflow-x-auto no-scrollbar"
        >
          <TabsList variant="chips">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <TabsTrigger key={tab.key} value={tab.key} className="gap-2">
                  <span>{tab.label}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-1.5 py-0 h-4 text-2xs font-bold rounded-md border",
                      isActive
                        ? "bg-muted text-foreground border-border"
                        : "bg-background/80 text-muted-foreground border-border/60"
                    )}
                  >
                    {tab.count}
                  </Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>

        <AdminFilterBar
          search={{ value: searchQuery, onChange: setSearchQuery, placeholder: "Search payments" }}
          activeCount={statusFilter !== "all" ? 1 : 0}
          onReset={handleReset}
        >
          <AdminFilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} widthClassName="w-36" />
        </AdminFilterBar>

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
                      className={cn("py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80", actionColumnClass(header.column.id, "head"))}
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
                      <TableCell key={cell.id} className={cn("py-3 px-4 text-xs", actionColumnClass(cell.column.id))}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <DataTableEmpty
                  colSpan={columns.length}
                  title="No payment transactions found"
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
                        {tx.displayId}
                      </span>
                      <span className="text-xxs font-semibold text-foreground block">
                        {tx.payerName}
                      </span>
                      <span className="font-mono text-2xs text-muted-foreground block">
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
                        className="text-3xs uppercase font-bold px-1.5 py-0 h-4 shrink-0"
                      >
                        {tx.purpose}
                      </Badge>
                      <span className="text-xxs text-muted-foreground truncate">
                        {tx.purposeTitle}
                      </span>
                    </div>
                    <span className="text-xxs text-muted-foreground whitespace-nowrap">
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
              title="No payment transactions found"
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
