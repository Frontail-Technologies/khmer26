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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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
import { useAdminVerifications } from "../hooks/verifications.queries"

interface VerificationTableProps {
  initialData?: VerificationRequest[]
}

export function VerificationTable({ initialData }: VerificationTableProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [sellerTypeFilter, setSellerTypeFilter] = useState("")
  const { data, isLoading } = useAdminVerifications({ page: 1, limit: 100 })
  const requests = useMemo(() => data?.items ?? initialData ?? [], [data?.items, initialData])

  const filteredData = useMemo(() => {
    return requests.filter((item) => {
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
  }, [requests, searchQuery, statusFilter, typeFilter, sellerTypeFilter])

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

  const tabs = [
    { key: "all", label: "All Requests", count: requests.length },
    { key: "pending", label: "Pending Review", count: requests.filter((item) => item.status === "pending").length },
    { key: "in_review", label: "In Review", count: requests.filter((item) => item.status === "in_review").length },
    { key: "approved", label: "Approved", count: requests.filter((item) => item.status === "approved").length },
    { key: "rejected", label: "Rejected", count: requests.filter((item) => item.status === "rejected").length },
  ]

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setStatusFilter(value === "all" ? "" : value)
  }

  const handleReset = () => {
    setActiveTab("all")
    setSearchQuery("")
    setStatusFilter("")
    setTypeFilter("")
    setSellerTypeFilter("")
  }

  return (
    <Card className="rounded-xl border-0 bg-card shadow-2xs overflow-hidden flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={(value) => value && handleTabChange(value)}
        className="border-b border-border/60 bg-card px-3 sm:px-4 overflow-x-auto no-scrollbar"
      >
        <TabsList variant="line">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="gap-2">
              <span>{tab.label}</span>
              <Badge
                variant="outline"
                className="px-1.5 py-0 h-4 text-[10px] font-bold rounded-md border bg-background/80 text-muted-foreground border-border/60"
              >
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="px-3 sm:px-4 pt-3.5">
        <VerificationToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={(value) => {
            setStatusFilter(value)
            setActiveTab(value || "all")
          }}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          sellerTypeFilter={sellerTypeFilter}
          onSellerTypeChange={setSellerTypeFilter}
          onReset={handleReset}
          hasActiveFilters={hasActiveFilters}
          totalCount={requests.length}
          filteredCount={filteredData.length}
        />
      </div>

      <div className="hidden md:block flex-1 min-w-0 mt-3.5">
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
                  title={isLoading ? "Loading verification requests" : "No verification requests found"}
                  description={isLoading ? "Fetching the latest seller verification queue." : "Try adjusting your search terms or active filters."}
                />
              )}
            </TableBody>
        </Table>
      </div>

      <div className="block md:hidden p-3.5">
        <VerificationMobileCards data={filteredData} />
      </div>

      <div className="border-t border-border/60 bg-muted/10 p-2 sm:p-3">
        <DataTablePagination table={table} />
      </div>
    </Card>
  )
}
