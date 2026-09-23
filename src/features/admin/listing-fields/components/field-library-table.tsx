"use client"

import { useState, useMemo, useCallback } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import {
  MagnifyingGlass,
  Plus,
  PencilSimple,
  Trash,
  CaretUpDown,
  CaretUp,
  CaretDown,
} from "@phosphor-icons/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CreateFieldDialog } from "./create-field-dialog"
import type { ListingField } from "@/features/admin/categories/types"

interface FieldLibraryTableProps {
  fields: ListingField[]
  onUpdateFields: (fields: ListingField[]) => void
}

export function FieldLibraryTable({ fields, onUpdateFields }: FieldLibraryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingField, setEditingField] = useState<ListingField | null>(null)

  const filteredData = useMemo(() => {
    return fields.filter((f) => {
      const matchSearch =
        !search.trim() ||
        f.label.toLowerCase().includes(search.toLowerCase()) ||
        f.key.toLowerCase().includes(search.toLowerCase())

      const matchType = typeFilter === "all" || f.type === typeFilter
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && f.isActive) ||
        (statusFilter === "inactive" && !f.isActive)

      return matchSearch && matchType && matchStatus
    })
  }, [fields, search, typeFilter, statusFilter])

  const handleSaveField = (savedField: ListingField) => {
    const exists = fields.some((f) => f.id === savedField.id)
    if (exists) {
      onUpdateFields(fields.map((f) => (f.id === savedField.id ? savedField : f)))
    } else {
      onUpdateFields([savedField, ...fields])
    }
  }

  const handleDeleteField = useCallback(
    (id: string) => {
      onUpdateFields(fields.filter((f) => f.id !== id))
    },
    [fields, onUpdateFields]
  )

  const columns = useMemo<ColumnDef<ListingField>[]>(
    () => [
      {
        accessorKey: "label",
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 font-bold cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Field Label</span>
            {column.getIsSorted() === "asc" ? (
              <CaretUp size={12} weight="bold" />
            ) : column.getIsSorted() === "desc" ? (
              <CaretDown size={12} weight="bold" />
            ) : (
              <CaretUpDown size={12} className="opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const field = row.original
          return (
            <div className="space-y-0.5">
              <span className="font-bold text-foreground text-xs">{field.label}</span>
              {field.options && (
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {field.options.slice(0, 4).join(", ")}
                  {field.options.length > 4 && ` +${field.options.length - 4} more`}
                </p>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "key",
        header: "Internal Key",
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
            {row.original.key}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 font-bold cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Type</span>
            {column.getIsSorted() === "asc" ? (
              <CaretUp size={12} weight="bold" />
            ) : column.getIsSorted() === "desc" ? (
              <CaretDown size={12} weight="bold" />
            ) : (
              <CaretUpDown size={12} className="opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const type = row.original.type
          return (
            <Badge
              variant="secondary"
              className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-primary/10 text-primary border-primary/20"
            >
              {type}
            </Badge>
          )
        },
      },
      {
        accessorKey: "usedInCount",
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 font-bold cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Used In</span>
            {column.getIsSorted() === "asc" ? (
              <CaretUp size={12} weight="bold" />
            ) : column.getIsSorted() === "desc" ? (
              <CaretDown size={12} weight="bold" />
            ) : (
              <CaretUpDown size={12} className="opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const count = row.original.usedInCount ?? 0
          return (
            <span className="text-xs text-muted-foreground font-medium">
              {count} {count === 1 ? "category" : "categories"}
            </span>
          )
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const active = row.original.isActive ?? true
          return (
            <Badge
              variant="secondary"
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                active
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {active ? "Active" : "Inactive"}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const field = row.original
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingField(field)}
                className="size-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                title="Edit Field"
              >
                <PencilSimple size={13} weight="bold" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteField(field.id)}
                className="size-7 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                title="Delete Field"
              >
                <Trash size={13} weight="bold" />
              </Button>
            </div>
          )
        },
      },
    ],
    [handleDeleteField]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="p-3.5 sm:p-4 bg-muted/15 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlass
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              type="text"
              placeholder="Search by label or key..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8.5 text-xs rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8.5 px-2.5 rounded-lg bg-background border border-input text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
              <option value="boolean">Boolean</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8.5 px-2.5 rounded-lg bg-background border border-input text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateDialogOpen(true)}
          className="h-8.5 px-3.5 text-xs font-bold gap-1.5 rounded-lg cursor-pointer shrink-0"
        >
          <Plus size={13} weight="bold" />
          <span>Create Field</span>
        </Button>
      </div>

      <div className="p-3.5 sm:p-4 pt-0">
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs font-bold text-foreground h-9">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-xs text-muted-foreground">
                    No field definitions match the criteria.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/20">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5 text-xs">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>
            Showing {filteredData.length} total field definitions
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-7 px-2.5 text-xs rounded-lg"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-7 px-2.5 text-xs rounded-lg"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <CreateFieldDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSaveField}
      />

      {editingField && (
        <CreateFieldDialog
          open={Boolean(editingField)}
          onOpenChange={(open) => {
            if (!open) setEditingField(null)
          }}
          initialField={editingField}
          onSave={handleSaveField}
        />
      )}
    </div>
  )
}
