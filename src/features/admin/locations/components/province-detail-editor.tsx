"use client"

import { useState } from "react"
import { FloppyDisk, MapPin, PencilSimple, Plus, Power } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  useCreateAdminCommune,
  useCreateAdminDistrict,
  useUpdateAdminCommune,
  useUpdateAdminDistrict,
  useUpdateAdminProvince,
} from "../hooks/locations.mutations"
import type { CambodiaCommune, CambodiaDistrict, CambodiaProvince } from "../types"

interface ProvinceDetailEditorProps {
  province: CambodiaProvince | null
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

export function ProvinceDetailEditor({ province }: ProvinceDetailEditorProps) {
  const [name, setName] = useState(province?.name ?? "")
  const [nameKhmer, setNameKhmer] = useState(province?.nameKhmer ?? "")
  const [postalCode, setPostalCode] = useState(province?.postalCode ?? "")
  const [districtDialogOpen, setDistrictDialogOpen] = useState(false)
  const [communeDialogOpen, setCommuneDialogOpen] = useState(false)
  const [editingDistrict, setEditingDistrict] = useState<CambodiaDistrict | null>(null)
  const [editingCommune, setEditingCommune] = useState<CambodiaCommune | null>(null)
  const [targetDistrict, setTargetDistrict] = useState<CambodiaDistrict | null>(null)
  const [formName, setFormName] = useState("")
  const [formNameKm, setFormNameKm] = useState("")

  const updateProvince = useUpdateAdminProvince()
  const createDistrict = useCreateAdminDistrict()
  const updateDistrict = useUpdateAdminDistrict()
  const createCommune = useCreateAdminCommune()
  const updateCommune = useUpdateAdminCommune()

  if (!province) {
    return (
      <Card className="p-8 text-center text-xs text-muted-foreground bg-card border-0 rounded-xl shadow-2xs">
        Select a province from the sidebar to inspect districts.
      </Card>
    )
  }

  const allDistrictIds = province.districts.map((d) => Number(d.id) || 0)
  const allCommuneIds = province.districts.flatMap((d) => (d.communes ?? []).map((c) => Number(c.id) || 0))

  const handleSaveProvince = () => {
    updateProvince.mutate({
      id: province.id,
      data: {
        nameEn: name.trim(),
        nameKm: nameKhmer.trim() || name.trim(),
      },
    })
  }

  const openAddDistrict = () => {
    setEditingDistrict(null)
    setFormName("")
    setFormNameKm("")
    setDistrictDialogOpen(true)
  }

  const openEditDistrict = (district: CambodiaDistrict) => {
    setEditingDistrict(district)
    setFormName(district.name)
    setFormNameKm(district.nameKhmer ?? "")
    setDistrictDialogOpen(true)
  }

  const openAddCommune = (district: CambodiaDistrict) => {
    setTargetDistrict(district)
    setEditingCommune(null)
    setFormName("")
    setFormNameKm("")
    setCommuneDialogOpen(true)
  }

  const openEditCommune = (district: CambodiaDistrict, commune: CambodiaCommune) => {
    setTargetDistrict(district)
    setEditingCommune(commune)
    setFormName(commune.name)
    setFormNameKm(commune.nameKhmer ?? "")
    setCommuneDialogOpen(true)
  }

  const handleSaveDistrict = async () => {
    if (!formName.trim()) return
    if (editingDistrict) {
      await updateDistrict.mutateAsync({
        id: editingDistrict.id,
        data: {
          nameEn: formName.trim(),
          nameKm: formNameKm.trim() || formName.trim(),
          slug: slugify(formName) || editingDistrict.id,
        },
      })
    } else {
      const id = Math.max(0, ...allDistrictIds) + 1
      await createDistrict.mutateAsync({
        id,
        provinceId: Number(province.id),
        nameEn: formName.trim(),
        nameKm: formNameKm.trim() || formName.trim(),
        slug: slugify(formName) || `district-${id}`,
        type: province.type === "Municipality" ? "khan" : "district",
        isActive: true,
      })
    }
    setDistrictDialogOpen(false)
  }

  const handleSaveCommune = async () => {
    if (!targetDistrict || !formName.trim()) return
    if (editingCommune) {
      await updateCommune.mutateAsync({
        id: editingCommune.id,
        data: {
          nameEn: formName.trim(),
          nameKm: formNameKm.trim() || formName.trim(),
          slug: slugify(formName) || editingCommune.id,
        },
      })
    } else {
      const id = Math.max(0, ...allCommuneIds) + 1
      await createCommune.mutateAsync({
        id,
        districtId: Number(targetDistrict.id),
        nameEn: formName.trim(),
        nameKm: formNameKm.trim() || formName.trim(),
        slug: slugify(formName) || `commune-${id}`,
        type: province.type === "Municipality" ? "sangkat" : "commune",
        isActive: true,
      })
    }
    setCommuneDialogOpen(false)
  }

  const toggleDistrict = (district: CambodiaDistrict) => {
    updateDistrict.mutate({ id: district.id, data: { isActive: !district.isActive } })
  }

  const toggleCommune = (commune: CambodiaCommune) => {
    updateCommune.mutate({ id: commune.id, data: { isActive: !commune.isActive } })
  }

  return (
    <>
      <Card className="bg-card border-0 rounded-xl shadow-2xs">
        <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin size={14} />
              Division Details: {province.name} ({province.nameKhmer || province.name})
            </CardTitle>
            <span className="text-[10px] text-muted-foreground block">
              {province.type} • Postal Prefix: {province.postalCode} • {province.listingCount.toLocaleString()} ads
            </span>
          </div>

          <Button size="sm" className="h-8 text-xs" onClick={handleSaveProvince} disabled={updateProvince.isPending}>
            <FloppyDisk size={14} className="mr-1.5" />
            {updateProvince.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardHeader>

        <CardContent className="p-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field className="gap-2">
              <FieldLabel>Province Name (English)</FieldLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs" />
            </Field>

            <Field className="gap-2">
              <FieldLabel>Name (Khmer)</FieldLabel>
              <Input value={nameKhmer} onChange={(e) => setNameKhmer(e.target.value)} className="h-8 text-xs font-medium" />
            </Field>

            <Field className="gap-2">
              <FieldLabel>Postal Code Prefix</FieldLabel>
              <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="h-8 text-xs font-mono" />
            </Field>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground block">
                  Administrative Districts & Khans ({province.districts.length})
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Districts registered under {province.name}
                </span>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={openAddDistrict}>
                <Plus size={13} weight="bold" />
                <span>Add District</span>
              </Button>
            </div>

            <div className="space-y-2">
              {province.districts.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg">
                  No districts registered yet.
                </div>
              ) : (
                province.districts.map((dist) => (
                  <div key={dist.id} className="p-3 rounded-lg bg-muted/30 border-0 text-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{dist.name}</span>
                          {dist.nameKhmer && <span className="text-[11px] text-muted-foreground">{dist.nameKhmer}</span>}
                          <Badge variant={dist.isActive ? "outline" : "secondary"} className="text-[10px] h-4.5">
                            {dist.isActive ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span>{dist.sangkatsCount} Communes / Sangkats</span>
                          <span>•</span>
                          <span className="font-medium text-foreground">{dist.listingCount.toLocaleString()} ads</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="icon-xs" variant="ghost" className="size-7" onClick={() => openEditDistrict(dist)} aria-label="Edit district">
                          <PencilSimple size={13} />
                        </Button>
                        <Button size="icon-xs" variant="ghost" className="size-7" onClick={() => toggleDistrict(dist)} aria-label={dist.isActive ? "Disable district" : "Enable district"}>
                          <Power size={13} />
                        </Button>
                        <Button size="xs" variant="outline" className="h-7 text-[11px] gap-1" onClick={() => openAddCommune(dist)}>
                          <Plus size={11} />
                          Add Commune
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {(dist.communes ?? []).length === 0 ? (
                        <div className="rounded-md bg-background/50 px-3 py-2 text-[11px] text-muted-foreground">
                          No communes registered yet.
                        </div>
                      ) : (
                        (dist.communes ?? []).map((commune) => (
                          <div key={commune.id} className="flex items-center justify-between gap-2 rounded-md bg-background/60 px-3 py-2">
                            <div className="min-w-0">
                              <span className="font-medium text-foreground">{commune.name}</span>
                              {commune.nameKhmer && <span className="ml-2 text-[11px] text-muted-foreground">{commune.nameKhmer}</span>}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Badge variant={commune.isActive ? "outline" : "secondary"} className="h-4.5 text-[10px]">
                                {commune.isActive ? "Active" : "Disabled"}
                              </Badge>
                              <Button size="icon-xs" variant="ghost" className="size-6" onClick={() => openEditCommune(dist, commune)} aria-label="Edit commune">
                                <PencilSimple size={12} />
                              </Button>
                              <Button size="icon-xs" variant="ghost" className="size-6" onClick={() => toggleCommune(commune)} aria-label={commune.isActive ? "Disable commune" : "Enable commune"}>
                                <Power size={12} />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={districtDialogOpen} onOpenChange={setDistrictDialogOpen}>
        <DialogContent className="sm:max-w-md p-5 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">{editingDistrict ? "Edit District" : "Add District"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Field>
              <FieldLabel required>District Name</FieldLabel>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="h-9 text-xs" />
            </Field>
            <Field>
              <FieldLabel>Name Khmer</FieldLabel>
              <Input value={formNameKm} onChange={(e) => setFormNameKm(e.target.value)} className="h-9 text-xs" />
            </Field>
          </div>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDistrictDialogOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveDistrict} disabled={!formName.trim() || createDistrict.isPending || updateDistrict.isPending} className="text-xs">
              {createDistrict.isPending || updateDistrict.isPending ? "Saving..." : "Save District"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={communeDialogOpen} onOpenChange={setCommuneDialogOpen}>
        <DialogContent className="sm:max-w-md p-5 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">{editingCommune ? "Edit Commune" : "Add Commune"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Field>
              <FieldLabel required>Commune Name</FieldLabel>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="h-9 text-xs" />
            </Field>
            <Field>
              <FieldLabel>Name Khmer</FieldLabel>
              <Input value={formNameKm} onChange={(e) => setFormNameKm(e.target.value)} className="h-9 text-xs" />
            </Field>
          </div>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setCommuneDialogOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveCommune} disabled={!formName.trim() || createCommune.isPending || updateCommune.isPending} className="text-xs">
              {createCommune.isPending || updateCommune.isPending ? "Saving..." : "Save Commune"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
