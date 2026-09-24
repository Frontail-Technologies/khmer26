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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { createPaymentColumns } from "../columns"
import { PaymentSummaryMetrics } from "./payment-summary-metrics"
import { PaymentToolbar } from "./payment-toolbar"
import { PaymentDetailSheet } from "./payment-detail-sheet"
import type { AdminPaymentTransaction, PaymentFinancialStats } from "../types"

interface PaymentTableProps {
  stats: PaymentFinancialStats
  initialPayments: AdminPaymentTransaction[]
}

export function PaymentTable({ stats, initialPayments }: PaymentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [gatewayFilter, setGatewayFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [purposeFilter, setPurposeFilter] = useState("all")
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
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesId = tx.id.toLowerCase().includes(q)
        const matchesRef = tx.transactionReference.toLowerCase().includes(q)
        const matchesPayer = tx.payerName.toLowerCase().includes(q)
        const matchesPhone = tx.payerPhone.toLowerCase().includes(q)
        const matchesPurpose = tx.purposeTitle.toLowerCase().includes(q)
        if (!matchesId && !matchesRef && !matchesPayer && !matchesPhone && !matchesPurpose) {
          return false
        }
      }

      if (gatewayFilter !== "all" && tx.gateway !== gatewayFilter) {
        return false
      }

      if (statusFilter !== "all" && tx.status !== statusFilter) {
        return false
      }

      if (purposeFilter !== "all" && tx.purpose !== purposeFilter) {
        return false
      }

      return true
    })
  }, [initialPayments, searchQuery, gatewayFilter, statusFilter, purposeFilter])

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
    Boolean(searchQuery) ||
    gatewayFilter !== "all" ||
    statusFilter !== "all" ||
    purposeFilter !== "all"

  const handleReset = () => {
    setSearchQuery("")
    setGatewayFilter("all")
    setStatusFilter("all")
    setPurposeFilter("all")
  }

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <PaymentSummaryMetrics stats={stats} />

      <PaymentToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        gatewayFilter={gatewayFilter}
        onGatewayChange={setGatewayFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        purposeFilter={purposeFilter}
        onPurposeChange={setPurposeFilter}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        totalCount={initialPayments.length}
        filteredCount={filteredData.length}
      />

      <div className="min-w-0 rounded-xl bg-card overflow-hidden shadow-2xs">
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
                      className="py-2.5 px-3.5 text-[11px] font-bold text-muted-foreground dark:text-foreground/80"
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
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleViewDetails(row.original)}
                    className="transition-colors hover:bg-muted/30 border-b border-border/60 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5 px-3.5 text-xs">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <DataTableEmpty
                  colSpan={columns.length}
                  title="No payment transactions found"
                  description="Try adjusting your transaction search query or active gateway filters."
                />
              )}
            </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      <PaymentDetailSheet
        transaction={selectedTx}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
