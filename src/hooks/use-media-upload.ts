"use client"

import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  MediaUploadError,
  uploadMediaFile,
  validateImageFile,
  type MediaPurpose,
} from "@/lib/api/media"

export interface UploadItem {
  id: string
  file?: File
  name?: string
  size?: number
  /** Local object URL so the picture shows instantly, before and after the upload. */
  previewUrl: string
  progress: number
  status: "uploading" | "done" | "error"
  mediaId?: string
  error?: string
}

interface Options {
  purpose: MediaPurpose
  /** How many files this picker may hold in total (e.g. the effective photo limit). */
  max: number
  /** How many uploads run at once. */
  concurrency?: number
  /** Already attached remote files when editing an existing listing. */
  initialItems?: UploadItem[]
}

let nextId = 0

/**
 * Multi-file image upload queue: validates each file, uploads it (presign -> storage -> confirm)
 * with progress, and exposes the confirmed media ids. Files can be removed (cancelling an upload
 * in flight), retried and reordered. Everything is cleaned up on unmount.
 */
export function useMediaUpload({ purpose, max, concurrency = 3, initialItems = [] }: Options) {
  const tCommon = useTranslations("ui.common")
  const [items, setItems] = useState<UploadItem[]>(initialItems)
  const [rejections, setRejections] = useState<string[]>([])
  const controllers = useRef(new Map<string, AbortController>())
  const queue = useRef<string[]>([])
  const running = useRef(0)
  const itemsRef = useRef<UploadItem[]>(initialItems)
  // `pump` re-enters itself when an upload finishes; it does so through a ref kept current below.
  const pumpRef = useRef<() => void>(() => {})

  const patch = useCallback((id: string, changes: Partial<UploadItem>) => {
    setItems((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
      itemsRef.current = next
      return next
    })
  }, [])

  const pump = useCallback(() => {
    while (running.current < concurrency && queue.current.length > 0) {
      const id = queue.current.shift()!
      const item = itemsRef.current.find((i) => i.id === id)
      if (!item?.file) continue

      const controller = new AbortController()
      controllers.current.set(id, controller)
      running.current += 1
      patch(id, { status: "uploading", progress: 0, error: undefined })

      uploadMediaFile(item.file, purpose, {
        signal: controller.signal,
        onProgress: (progress) => patch(id, { progress }),
      })
        .then(({ mediaId }) => patch(id, { status: "done", progress: 100, mediaId }))
        .catch((err: unknown) => {
          if (err instanceof MediaUploadError && err.code === "UPLOAD_ABORTED") return
          patch(id, {
            status: "error",
            error: err instanceof Error ? err.message : tCommon("uploadFailed"),
          })
        })
        .finally(() => {
          controllers.current.delete(id)
          running.current -= 1
          pumpRef.current()
        })
    }
  }, [concurrency, patch, purpose, tCommon])

  useEffect(() => {
    pumpRef.current = pump
  }, [pump])

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files)
      const room = Math.max(0, max - itemsRef.current.length)
      const problems: string[] = []
      const accepted: UploadItem[] = []

      for (const file of incoming) {
        const invalid = validateImageFile(file)
        if (invalid) {
          problems.push(invalid.message)
        } else if (accepted.length >= room) {
          problems.push(`${file.name}: you can add up to ${max} photos.`)
        } else {
          accepted.push({
            id: `upload-${nextId++}`,
            file,
            previewUrl: URL.createObjectURL(file),
            progress: 0,
            status: "uploading",
          })
        }
      }

      setRejections(problems)
      if (accepted.length === 0) return

      const next = [...itemsRef.current, ...accepted]
      itemsRef.current = next
      setItems(next)
      queue.current.push(...accepted.map((a) => a.id))
      pump()
    },
    [max, pump]
  )

  const remove = useCallback((id: string) => {
    controllers.current.get(id)?.abort()
    queue.current = queue.current.filter((queued) => queued !== id)
    const target = itemsRef.current.find((i) => i.id === id)
    if (target?.file) URL.revokeObjectURL(target.previewUrl)
    const next = itemsRef.current.filter((i) => i.id !== id)
    itemsRef.current = next
    setItems(next)
  }, [])

  const retry = useCallback(
    (id: string) => {
      const item = itemsRef.current.find((i) => i.id === id)
    if (!item?.file || item.status !== "error") return
      patch(id, { status: "uploading", progress: 0, error: undefined })
      queue.current.push(id)
      pump()
    },
    [patch, pump]
  )

  /** Reorder by id list (e.g. from a drag-and-drop list). Unknown ids are ignored. */
  const reorder = useCallback((ids: string[]) => {
    const byId = new Map(itemsRef.current.map((i) => [i.id, i]))
    const next = ids.map((id) => byId.get(id)).filter((i): i is UploadItem => Boolean(i))
    itemsRef.current = next
    setItems(next)
  }, [])

  const clear = useCallback(() => {
    for (const controller of controllers.current.values()) controller.abort()
    for (const item of itemsRef.current) {
      if (item.file) URL.revokeObjectURL(item.previewUrl)
    }
    queue.current = []
    itemsRef.current = []
    setItems([])
    setRejections([])
  }, [])

  useEffect(() => {
    const active = controllers.current
    return () => {
      for (const controller of active.values()) controller.abort()
      for (const item of itemsRef.current) {
        if (item.file) URL.revokeObjectURL(item.previewUrl)
      }
    }
  }, [])

  return {
    items,
    /** Reasons the last selection was (partly) refused: wrong type, too large, over the limit. */
    rejections,
    /** Confirmed media ids in display order; only finished uploads. */
    mediaIds: items.flatMap((i) => (i.status === "done" && i.mediaId ? [i.mediaId] : [])),
    isUploading: items.some((i) => i.status === "uploading"),
    hasErrors: items.some((i) => i.status === "error"),
    addFiles,
    remove,
    retry,
    reorder,
    clear,
  }
}
