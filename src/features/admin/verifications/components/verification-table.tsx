"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
import { VerificationToolbar } from "./verification-toolbar"
import { VerificationMobileCards } from "./verification-mobile-cards"
import { verificationColumns } from "../columns"
import type { VerificationRequest } from "../types"

interface VerificationTableProps {
  initialData: VerificationRequest[]
}

export function VerificationTable({ initialData }: VerificationTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [sellerTypeFilter, setSellerTypeFilter] = useState("")

  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false
      if (typeFilter && item.type !== typeFilter) return false
      if (sellerTypeFilter && item.seller.sellerType !== sellerTypeFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = item.seller.name.toLowerCase().includes(q)
        const matchesEmail = item.seller.email.toLowerCase().includes(q)
        const matchesPhone = item.seller.phone.toLowerCase().includes(q)
        const matchesId = item.id.toLowerCase().includes(q)
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesId) return false
      }
      return true
    })
  }, [initialData, searchQuery, statusFilter, typeFilter, sellerTypeFilter])

  const table = useReactTable({
    data: filteredData,
    columns: verificationColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const hasActiveFilters = Boolean(searchQuery || statusFilter || typeFilter || sellerTypeFilter)

  const handleReset = () => {
    setSearchQuery("")
    setStatusFilter("")
    setTypeFilter("")
    setSellerTypeFilter("")
  }

  return (
    <div className="space-y-3.5">
      <VerificationToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        sellerTypeFilter={sellerTypeFilter}
        onSellerTypeChange={setSellerTypeFilter}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        totalCount={initialData.length}
        filteredCount={filteredData.length}
      />

      <div className="hidden md:block min-w-0 rounded-xl bg-card overflow-hidden shadow-2xs">
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
                    onClick={() => router.push(`/admin/verifications/${row.original.id}`)}
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
                  colSpan={verificationColumns.length}
                  title="No verification requests found"
                  description="Try adjusting your search terms or active filters."
                />
              )}
            </TableBody>
        </Table>
      </div>

      <div className="block md:hidden">
        <VerificationMobileCards data={filteredData} />
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
