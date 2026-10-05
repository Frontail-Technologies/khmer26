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
import { createUserColumns } from "../columns"
import { UserToolbar } from "./user-toolbar"
import { UserMobileCards } from "./user-mobile-cards"
import type { AdminUserListItem } from "../types"
import { cn } from "@/lib/utils"
import { useAdminUsers } from "../hooks/users.queries"
import { useDeleteAdminUser } from "../hooks/users.mutations"
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog"

interface UserTableProps {
  initialData?: AdminUserListItem[]
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
  const [deleteTarget, setDeleteTarget] = useState<AdminUserListItem | null>(null)
  const { data, isLoading } = useAdminUsers({ page: 1, limit: 100 })
  const deleteUser = useDeleteAdminUser()
  const users = useMemo(() => data?.items ?? initialData ?? [], [data?.items, initialData])
  const columns = useMemo(() => createUserColumns(setDeleteTarget), [])

  const counts = useMemo(() => {
    return {
      all: users.length,
      buyer: users.filter((u) => u.accountType === "buyer").length,
      seller: users.filter((u) => u.accountType === "seller" || u.accountType === "business" || u.accountType === "dealer").length,
      business_dealer: users.filter((u) => u.accountType === "business" || u.accountType === "dealer").length,
      restricted: users.filter((u) => u.status === "restricted" || u.status === "suspended").length,
    }
  }, [users])

  const filteredData = useMemo(() => {
    return users.filter((user) => {
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
    users,
    activeTab,
    searchQuery,
    accountTypeFilter,
    statusFilter,
    verificationFilter,
    provinceFilter,
  ])

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
                        ? "bg-accent/10 text-accent border-accent/30"
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
        totalCount={users.length}
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
                  colSpan={columns.length}
                  title="No accounts found"
                  description={isLoading ? "Fetching the latest user accounts." : "Try adjusting your search terms, account tabs, or active filters."}
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
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Account"
        description={`This will remove ${deleteTarget?.businessName || deleteTarget?.name || "this account"} from active admin views and prevent login.`}
        confirmLabel="Delete Account"
        variant="destructive"
        isPending={deleteUser.isPending}
        onConfirm={async () => {
          if (!deleteTarget) return
          await deleteUser.mutateAsync(deleteTarget.id)
          setDeleteTarget(null)
        }}
      />
    </Card>
  )
}
