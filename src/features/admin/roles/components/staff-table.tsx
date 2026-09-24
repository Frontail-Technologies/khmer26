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
import { MagnifyingGlass, UserPlus } from "@phosphor-icons/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { staffColumns } from "../columns"
import type { AdminStaffMember } from "../types"

interface StaffTableProps {
  initialStaff: AdminStaffMember[]
}

const ROLE_FILTER_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Roles" },
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Administrator" },
  { value: "moderator", label: "Moderator" },
  { value: "support", label: "Support" },
]

export function StaffTable({ initialStaff }: StaffTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredData = useMemo(() => {
    return initialStaff.filter((staff) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = staff.name.toLowerCase().includes(q)
        const matchesEmail = staff.email.toLowerCase().includes(q)
        const matchesId = staff.id.toLowerCase().includes(q)
        if (!matchesName && !matchesEmail && !matchesId) return false
      }

      if (roleFilter !== "all" && staff.role !== roleFilter) {
        return false
      }

      return true
    })
  }, [initialStaff, searchQuery, roleFilter])

  const table = useReactTable({
    data: filteredData,
    columns: staffColumns,
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

  return (
    <div className="min-w-0 rounded-xl bg-card overflow-hidden shadow-2xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4">
        <div className="relative flex-1 min-w-[240px]">
          <MagnifyingGlass
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search staff by name, email, or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9.5 pl-9.5 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Select
            value={roleFilter}
            items={ROLE_FILTER_OPTIONS}
            onValueChange={(val) => setRoleFilter(val ?? "all")}
          >
            <SelectTrigger className="h-9.5 text-xs w-[140px]">
              <SelectValue placeholder="All Roles">
                {(val) => getSelectOptionLabel(ROLE_FILTER_OPTIONS, val, "All Roles")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ROLE_FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button size="sm" className="h-9.5 text-xs font-semibold gap-1.5 rounded-lg">
            <UserPlus size={15} weight="bold" />
            <span>Invite Operator</span>
          </Button>
        </div>
      </div>

      <div className="border-t border-border/60">
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
                  className="transition-colors hover:bg-muted/25 border-b border-border/60 h-14"
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
                colSpan={staffColumns.length}
                title="No staff members found"
                description="Try adjusting your search criteria or active filters."
              />
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-3 sm:p-4 border-t border-border/60 bg-muted/10">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
