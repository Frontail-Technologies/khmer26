import { beforeEach, describe, expect, it, vi } from "vitest"
import { act, waitFor } from "@testing-library/react"
import { renderHookWithProviders } from "@/test/test-utils"

const uploadMediaFile = vi.fn()
vi.mock("@/lib/api/media", async (orig) => ({
  ...(await orig<typeof import("@/lib/api/media")>()),
  uploadMediaFile: (...a: unknown[]) => uploadMediaFile(...a),
}))

import { MediaUploadError } from "@/lib/api/media"
import { useMediaUpload } from "./use-media-upload"

const img = (name: string, type = "image/jpeg", size = 1000) => {
  const f = new File(["x"], name, { type })
  Object.defineProperty(f, "size", { value: size })
  return f
}

const deferred = <T,>() => {
  let resolve!: (v: T) => void
  let reject!: (e: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const setup = (options: Partial<Parameters<typeof useMediaUpload>[0]> = {}) =>
  renderHookWithProviders(() => useMediaUpload({ purpose: "listing_image", max: 3, ...options }))

beforeEach(() => {
  uploadMediaFile.mockReset()
  let n = 0
  URL.createObjectURL = vi.fn(() => `blob:preview-${n++}`)
  URL.revokeObjectURL = vi.fn()
})

describe("useMediaUpload", () => {
  it("uploads every accepted file and exposes the confirmed media ids in order", async () => {
    uploadMediaFile.mockImplementation(async (f: File) => ({ mediaId: `id-${f.name}` }))
    const { result } = setup()

    act(() => result.current.addFiles([img("a.jpg"), img("b.png", "image/png")]))

    await waitFor(() => expect(result.current.mediaIds).toEqual(["id-a.jpg", "id-b.png"]))
    expect(result.current.isUploading).toBe(false)
    expect(result.current.rejections).toEqual([])
    expect(uploadMediaFile).toHaveBeenCalledWith(expect.any(File), "listing_image", expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  it("refuses wrong types and oversize files without uploading them", () => {
    const { result } = setup()
    act(() => result.current.addFiles([img("a.gif", "image/gif"), img("huge.jpg", "image/jpeg", 11 * 1024 * 1024)]))

    expect(result.current.items).toHaveLength(0)
    expect(result.current.rejections).toHaveLength(2)
    expect(uploadMediaFile).not.toHaveBeenCalled()
  })

  it("stops at the photo limit and says so", async () => {
    uploadMediaFile.mockImplementation(async (f: File) => ({ mediaId: f.name }))
    const { result } = setup({ max: 2 })

    act(() => result.current.addFiles([img("1.jpg"), img("2.jpg"), img("3.jpg")]))

    expect(result.current.items).toHaveLength(2)
    expect(result.current.rejections[0]).toContain("up to 2 photos")
    await waitFor(() => expect(result.current.mediaIds).toHaveLength(2))
  })

  it("runs only `concurrency` uploads at a time", async () => {
    const first = deferred<{ mediaId: string }>()
    uploadMediaFile.mockReturnValueOnce(first.promise).mockResolvedValue({ mediaId: "second" })
    const { result } = setup({ concurrency: 1 })

    act(() => result.current.addFiles([img("1.jpg"), img("2.jpg")]))
    expect(uploadMediaFile).toHaveBeenCalledTimes(1)

    await act(async () => first.resolve({ mediaId: "first" }))
    await waitFor(() => expect(uploadMediaFile).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(result.current.mediaIds).toEqual(["first", "second"]))
  })

  it("keeps a failed upload visible with its error and retries it", async () => {
    uploadMediaFile.mockRejectedValueOnce(new MediaUploadError("UPLOAD_FAILED", "Network error while uploading."))
    const { result } = setup()
    act(() => result.current.addFiles([img("a.jpg")]))

    await waitFor(() => expect(result.current.hasErrors).toBe(true))
    expect(result.current.items[0]!.error).toBe("Network error while uploading.")
    expect(result.current.mediaIds).toEqual([])

    uploadMediaFile.mockResolvedValueOnce({ mediaId: "ok" })
    act(() => result.current.retry(result.current.items[0]!.id))

    await waitFor(() => expect(result.current.mediaIds).toEqual(["ok"]))
    expect(result.current.hasErrors).toBe(false)
  })

  it("cancels an in-flight upload when its photo is removed", async () => {
    let signal: AbortSignal | undefined
    uploadMediaFile.mockImplementation((_f: File, _p: string, opts: { signal: AbortSignal }) => {
      signal = opts.signal
      return new Promise((_, reject) => opts.signal.addEventListener("abort", () => reject(new MediaUploadError("UPLOAD_ABORTED", "x"))))
    })
    const { result } = setup()
    act(() => result.current.addFiles([img("a.jpg")]))
    const id = result.current.items[0]!.id

    act(() => result.current.remove(id))

    expect(signal?.aborted).toBe(true)
    expect(result.current.items).toHaveLength(0)
    expect(URL.revokeObjectURL).toHaveBeenCalled()
    expect(result.current.hasErrors).toBe(false)
  })

  it("reorders photos and the media ids follow the new order", async () => {
    uploadMediaFile.mockImplementation(async (f: File) => ({ mediaId: f.name }))
    const { result } = setup()
    act(() => result.current.addFiles([img("a.jpg"), img("b.jpg"), img("c.jpg")]))
    await waitFor(() => expect(result.current.mediaIds).toHaveLength(3))

    const [a, b, c] = result.current.items.map((i) => i.id)
    act(() => result.current.reorder([c!, a!, b!]))

    expect(result.current.mediaIds).toEqual(["c.jpg", "a.jpg", "b.jpg"])
  })

  it("aborts everything and frees previews on unmount", () => {
    let signal: AbortSignal | undefined
    uploadMediaFile.mockImplementation((_f: File, _p: string, opts: { signal: AbortSignal }) => {
      signal = opts.signal
      return new Promise(() => {})
    })
    const { result, unmount } = setup()
    act(() => result.current.addFiles([img("a.jpg")]))

    unmount()

    expect(signal?.aborted).toBe(true)
    expect(URL.revokeObjectURL).toHaveBeenCalled()
  })
})
