"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
} from "@tanstack/react-table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { userColumns } from "../columns"
import { UserToolbar } from "./user-toolbar"
import { UserMobileCards } from "./user-mobile-cards"
import type { AdminUserListItem } from "../types"
import { cn } from "@/lib/utils"

interface UserTableProps {
  initialData: AdminUserListItem[]
}

type AccountTabKey = "all" | "buyer" | "seller" | "business_dealer" | "restricted"

export function UserTable({ initialData }: UserTableProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AccountTabKey>("all")
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [accountTypeFilter, setAccountTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [provinceFilter, setProvinceFilter] = useState("all")

  const counts = useMemo(() => {
    return {
      all: initialData.length,
      buyer: initialData.filter((u) => u.accountType === "buyer").length,
      seller: initialData.filter((u) => u.accountType === "seller" || u.accountType === "business" || u.accountType === "dealer").length,
      business_dealer: initialData.filter((u) => u.accountType === "business" || u.accountType === "dealer").length,
      restricted: initialData.filter((u) => u.status === "restricted" || u.status === "suspended").length,
    }
  }, [initialData])

  const filteredData = useMemo(() => {
    return initialData.filter((user) => {
      if (activeTab === "buyer" && user.accountType !== "buyer") {
        return false
      }
      if (
        activeTab === "seller" &&
        user.accountType !== "seller" &&
        user.accountType !== "business" &&
        user.accountType !== "dealer"
      ) {
        return false
      }
      if (
        activeTab === "business_dealer" &&
        user.accountType !== "business" &&
        user.accountType !== "dealer"
      ) {
        return false
      }
      if (
        activeTab === "restricted" &&
        user.status !== "restricted" &&
        user.status !== "suspended"
      ) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = user.name.toLowerCase().includes(q)
        const matchesId = user.id.toLowerCase().includes(q)
        const matchesEmail = user.email.toLowerCase().includes(q)
        const matchesPhone = user.phone.toLowerCase().includes(q)
        const matchesBiz = user.businessName?.toLowerCase().includes(q) ?? false
        if (!matchesName && !matchesId && !matchesEmail && !matchesPhone && !matchesBiz) {
          return false
        }
      }

      if (accountTypeFilter !== "all" && user.accountType !== accountTypeFilter) {
        return false
      }

      if (statusFilter !== "all" && user.status !== statusFilter) {
        return false
      }

      if (verificationFilter !== "all" && user.verificationStatus !== verificationFilter) {
        return false
      }

      if (provinceFilter !== "all" && user.province !== provinceFilter) {
        return false
      }

      return true
    })
  }, [
    initialData,
    activeTab,
    searchQuery,
    accountTypeFilter,
    statusFilter,
    verificationFilter,
    provinceFilter,
  ])

  const table = useReactTable({
    data: filteredData,
    columns: userColumns,
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
    accountTypeFilter !== "all" ||
    statusFilter !== "all" ||
    verificationFilter !== "all" ||
    provinceFilter !== "all"

  const handleReset = () => {
    setSearchQuery("")
    setAccountTypeFilter("all")
    setStatusFilter("all")
    setVerificationFilter("all")
    setProvinceFilter("all")
  }

  const tabs: { key: AccountTabKey; label: string; count?: number; warning?: boolean }[] = [
    { key: "all", label: "All Accounts", count: counts.all },
    { key: "buyer", label: "Buyers", count: counts.buyer },
    { key: "seller", label: "Sellers", count: counts.seller },
    { key: "business_dealer", label: "Businesses & Dealers", count: counts.business_dealer },
    { key: "restricted", label: "Restricted", count: counts.restricted, warning: counts.restricted > 0 },
  ]

  return (
    <Card className="rounded-xl border-0 bg-card shadow-2xs overflow-hidden flex flex-col">
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
                {tab.count !== undefined && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-1.5 py-0 h-4 text-[10px] font-bold rounded-md border",
                      tab.warning
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        : isActive
                        ? "bg-muted text-foreground border-border"
                        : "bg-background/80 text-muted-foreground border-border/60"
                    )}
                  >
                    {tab.count}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <UserToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        accountTypeFilter={accountTypeFilter}
        onAccountTypeChange={setAccountTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        verificationFilter={verificationFilter}
        onVerificationChange={setVerificationFilter}
        provinceFilter={provinceFilter}
        onProvinceChange={setProvinceFilter}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        totalCount={initialData.length}
        filteredCount={filteredData.length}
      />

      <div className="hidden md:block flex-1 min-w-0">
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
                    onClick={() => router.push(`/admin/users/${row.original.id}`)}
                    className="transition-colors hover:bg-muted/30 border-b border-border/60 cursor-pointer h-16"
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
                  colSpan={userColumns.length}
                  title="No accounts found"
                  description="Try adjusting your search terms, account tabs, or active filters."
                />
              )}
            </TableBody>
        </Table>
      </div>

      <div className="block md:hidden p-3.5">
        <UserMobileCards data={filteredData} />
      </div>

      <div className="border-t border-border/60 bg-muted/10 p-2 sm:p-3">
        <DataTablePagination table={table} />
      </div>
    </Card>
  )
}
