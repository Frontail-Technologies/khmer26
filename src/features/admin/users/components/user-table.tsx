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

interface UserTableProps {
  initialData: AdminUserListItem[]
}

export function UserTable({ initialData }: UserTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [accountTypeFilter, setAccountTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [provinceFilter, setProvinceFilter] = useState("all")

  const filteredData = useMemo(() => {
    return initialData.filter((user) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
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

  return (
    <div className="space-y-3.5">
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

      <div className="hidden md:block rounded-xl bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
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
                  colSpan={userColumns.length}
                  title="No accounts found"
                  description="Try adjusting your search terms or active account filters."
                />
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="block md:hidden">
        <UserMobileCards data={filteredData} />
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
