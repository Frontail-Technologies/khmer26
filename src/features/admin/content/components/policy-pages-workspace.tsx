"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowDown, ArrowSquareOut, ArrowUp, FloppyDisk, Plus, Trash } from "@phosphor-icons/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAdminContentPages } from "../hooks/content.queries"
import { useUpdateContentPage } from "../hooks/content.mutations"
import type { AdminContentPage, ContentPageSection, ContentPageSlug } from "../types"

const PAGE_OPTIONS: Array<{ slug: ContentPageSlug; label: string; href: string }> = [
  { slug: "posting-rules", label: "Posting Rules", href: "/posting-rules" },
  { slug: "terms", label: "Terms of Service", href: "/terms" },
  { slug: "privacy", label: "Privacy Policy", href: "/privacy" },
]

function textToBlocks(value: string) {
  return value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)
}

function textToItems(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean)
}

type EditorLanguage = "en" | "km"

const emptyKhmerSection = (id: string): ContentPageSection => ({ id, title: "", paragraphs: [], items: [] })

function PolicyPageEditor({ page }: { page: AdminContentPage }) {
  const updatePage = useUpdateContentPage()
  const [draft, setDraft] = useState(() => structuredClone(page))
  const [language, setLanguage] = useState<EditorLanguage>("en")
  const isKhmer = language === "km"

  const khmerSection = (id: string) => draft.sectionsKm?.find((section) => section.id === id) ?? emptyKhmerSection(id)

  const updateSection = (index: number, changes: Partial<ContentPageSection>) => {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, ...changes } : section
      ),
    }))
  }

  const updateKhmerSection = (id: string, changes: Partial<ContentPageSection>) => {
    setDraft((current) => {
      const existing = current.sectionsKm ?? []
      const next = existing.some((section) => section.id === id)
        ? existing.map((section) => (section.id === id ? { ...section, ...changes } : section))
        : [...existing, { ...emptyKhmerSection(id), ...changes }]
      return { ...current, sectionsKm: next }
    })
  }

  const moveSection = (index: number, direction: -1 | 1) => {
    setDraft((current) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= current.sections.length) return current
      const sections = [...current.sections]
      const [section] = sections.splice(index, 1)
      sections.splice(nextIndex, 0, section!)
      return { ...current, sections }
    })
  }

  const addSection = () => {
    setDraft((current) => ({
      ...current,
      sections: [...current.sections, {
        id: `section-${Date.now()}`,
        title: "New section",
        paragraphs: ["Add policy text here."],
        items: [],
      }],
    }))
  }

  const removeSection = (index: number) => {
    setDraft((current) => current.sections.length > 1
      ? { ...current, sections: current.sections.filter((_, sectionIndex) => sectionIndex !== index) }
      : current)
  }

  const save = () => {
    if (!draft.eyebrow.trim() || !draft.title.trim() || !draft.summary.trim()) {
      toast.error("English eyebrow, title, and summary are required")
      return
    }
    if (draft.sections.some((section) => !section.title.trim() || (!section.paragraphs.length && !section.items.length))) {
      toast.error("Each English section needs a title and content")
      return
    }
    const englishTitles = new Map(draft.sections.map((section) => [section.id, section.title]))
    const sectionsKm = (draft.sectionsKm ?? [])
      .filter((section) => englishTitles.has(section.id) && (section.paragraphs.length > 0 || section.items.length > 0))
      .map((section) => ({ ...section, title: section.title.trim() || englishTitles.get(section.id)! }))

    updatePage.mutate({
      slug: draft.slug,
      data: {
        eyebrow: draft.eyebrow.trim(),
        title: draft.title.trim(),
        summary: draft.summary.trim(),
        sections: draft.sections,
        eyebrowKm: draft.eyebrowKm?.trim() || null,
        titleKm: draft.titleKm?.trim() || null,
        summaryKm: draft.summaryKm?.trim() || null,
        sectionsKm: sectionsKm.length > 0 ? sectionsKm : null,
        isPublished: draft.isPublished,
      },
    })
  }

  const publicHref = PAGE_OPTIONS.find((item) => item.slug === draft.slug)!.href
  const translatedSections = draft.sections.filter((section) => {
    const km = draft.sectionsKm?.find((item) => item.id === section.id)
    return km && (km.paragraphs.length > 0 || km.items.length > 0)
  }).length

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Switch checked={draft.isPublished} onCheckedChange={(checked) => setDraft({ ...draft, isPublished: checked })} aria-label="Publish page" />
          <span className="text-sm font-medium">{draft.isPublished ? "Published" : "Draft"}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" render={<Link href={publicHref} target="_blank" />}><ArrowSquareOut /> View page</Button>
          <Button onClick={save} disabled={updatePage.isPending}><FloppyDisk /> {updatePage.isPending ? "Saving..." : "Save"}</Button>
        </div>
      </div>

      <Tabs value={language} onValueChange={(value) => value && setLanguage(value as EditorLanguage)}>
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="km">
            ខ្មែរ
            <span className="ml-1.5 text-xxs text-muted-foreground">{translatedSections}/{draft.sections.length}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="policy-eyebrow" required={!isKhmer}>Eyebrow</FieldLabel>
          <Input
            id="policy-eyebrow"
            lang={language}
            value={isKhmer ? draft.eyebrowKm ?? "" : draft.eyebrow}
            placeholder={isKhmer ? draft.eyebrow : undefined}
            maxLength={120}
            onChange={(event) => setDraft(isKhmer ? { ...draft, eyebrowKm: event.target.value } : { ...draft, eyebrow: event.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="policy-title" required={!isKhmer}>Page title</FieldLabel>
          <Input
            id="policy-title"
            lang={language}
            value={isKhmer ? draft.titleKm ?? "" : draft.title}
            placeholder={isKhmer ? draft.title : undefined}
            maxLength={200}
            onChange={(event) => setDraft(isKhmer ? { ...draft, titleKm: event.target.value } : { ...draft, title: event.target.value })}
          />
        </Field>
        <Field className="lg:col-span-2">
          <FieldLabel htmlFor="policy-summary" required={!isKhmer}>Summary</FieldLabel>
          <Textarea
            id="policy-summary"
            lang={language}
            value={isKhmer ? draft.summaryKm ?? "" : draft.summary}
            placeholder={isKhmer ? draft.summary : undefined}
            maxLength={1000}
            onChange={(event) => setDraft(isKhmer ? { ...draft, summaryKm: event.target.value } : { ...draft, summary: event.target.value })}
          />
        </Field>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {draft.sections.map((section, index) => {
          const km = khmerSection(section.id)
          const heading = isKhmer ? km.title : section.title
          const paragraphs = isKhmer ? km.paragraphs : section.paragraphs
          const items = isKhmer ? km.items : section.items
          const change = (changes: Partial<ContentPageSection>) =>
            isKhmer ? updateKhmerSection(section.id, changes) : updateSection(index, changes)

          return (
            <section key={section.id} className="space-y-4 py-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">Section {index + 1}</span>
                {!isKhmer && (
                  <div className="flex items-center gap-1">
                    <Button size="icon-sm" variant="ghost" aria-label="Move section up" disabled={index === 0} onClick={() => moveSection(index, -1)}><ArrowUp /></Button>
                    <Button size="icon-sm" variant="ghost" aria-label="Move section down" disabled={index === draft.sections.length - 1} onClick={() => moveSection(index, 1)}><ArrowDown /></Button>
                    <Button size="icon-sm" variant="destructive" aria-label="Delete section" disabled={draft.sections.length === 1} onClick={() => removeSection(index)}><Trash /></Button>
                  </div>
                )}
              </div>
              <Field>
                <FieldLabel htmlFor={`section-title-${section.id}`}>Heading</FieldLabel>
                <Input
                  id={`section-title-${section.id}`}
                  lang={language}
                  value={heading}
                  placeholder={isKhmer ? section.title : undefined}
                  maxLength={200}
                  onChange={(event) => change({ title: event.target.value })}
                />
              </Field>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor={`section-copy-${section.id}`}>Paragraphs</FieldLabel>
                  <Textarea
                    id={`section-copy-${section.id}`}
                    lang={language}
                    className="min-h-32"
                    value={paragraphs.join("\n\n")}
                    placeholder={isKhmer ? section.paragraphs.join("\n\n") : undefined}
                    onChange={(event) => change({ paragraphs: textToBlocks(event.target.value) })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`section-items-${section.id}`}>List items</FieldLabel>
                  <Textarea
                    id={`section-items-${section.id}`}
                    lang={language}
                    className="min-h-32"
                    value={items.join("\n")}
                    placeholder={isKhmer ? section.items.join("\n") : undefined}
                    onChange={(event) => change({ items: textToItems(event.target.value) })}
                  />
                </Field>
              </div>
            </section>
          )
        })}
      </div>

      {!isKhmer && <Button variant="outline" onClick={addSection}><Plus /> Add section</Button>}
    </div>
  )
}

export function PolicyPagesWorkspace() {
  const pagesQuery = useAdminContentPages()
  const [selectedSlug, setSelectedSlug] = useState<ContentPageSlug>("posting-rules")
  const selectedPage = pagesQuery.data?.find((item) => item.slug === selectedSlug)

  if (pagesQuery.isPending) {
    return <Card className="space-y-4 p-5"><Skeleton className="h-11 w-full" /><Skeleton className="h-96 w-full" /></Card>
  }

  if (pagesQuery.isError) {
    return <Card className="items-center gap-3 p-8 text-center"><p className="font-medium">Policy pages could not be loaded.</p><Button variant="outline" onClick={() => pagesQuery.refetch()}>Try again</Button></Card>
  }

  return (
    <Card className="rounded-lg">
      <Tabs className="px-4 pt-3 sm:px-6 sm:pt-4" value={selectedSlug} onValueChange={(value) => value && setSelectedSlug(value as ContentPageSlug)}>
        <TabsList variant="line">
          {PAGE_OPTIONS.map((option) => <TabsTrigger key={option.slug} value={option.slug}>{option.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      {selectedPage ? (
        <PolicyPageEditor key={`${selectedPage.slug}-${selectedPage.updatedAt}`} page={selectedPage} />
      ) : (
        <p className="p-8 text-center text-sm text-muted-foreground">This policy page has not been seeded yet.</p>
      )}
    </Card>
  )
}
