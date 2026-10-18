import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const post = vi.fn()
const getApiRequestUrl = vi.fn((path: string) => `http://localhost:3002/api/v1${path}`)
const getCsrfTokenForRequest = vi.fn(async () => "csrf-token")
vi.mock("@/lib/api/client", () => ({
  apiClient: { post: (...a: unknown[]) => post(...a) },
  getApiRequestUrl: (path: string) => getApiRequestUrl(path),
  getCsrfTokenForRequest: () => getCsrfTokenForRequest(),
}))

import { MEDIA_LIMITS, MediaUploadError, uploadMediaFile, validateImageFile } from "./media"

type Mode = "ok" | "http500" | "network" | "hang"

class FakeXHR {
  static mode: Mode = "ok"
  static last: FakeXHR | null = null
  method = ""
  url = ""
  headers: Record<string, string> = {}
  sent: unknown = null
  status = 0
  withCredentials = false
  upload: { onprogress: ((e: { lengthComputable: boolean; loaded: number; total: number }) => void) | null } = { onprogress: null }
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  onabort: (() => void) | null = null

  open(method: string, url: string) {
    this.method = method
    this.url = url
  }
  setRequestHeader(key: string, value: string) {
    this.headers[key] = value
  }
  send(body: unknown) {
    this.sent = body
    FakeXHR.last = this
    queueMicrotask(() => {
      if (FakeXHR.mode === "hang") return
      if (FakeXHR.mode === "network") return this.onerror?.()
      this.upload.onprogress?.({ lengthComputable: true, loaded: 50, total: 100 })
      this.status = FakeXHR.mode === "http500" ? 500 : 200
      this.onload?.()
    })
  }
  abort() {
    this.onabort?.()
  }
}

const file = (name = "a.jpg", type = "image/jpeg", size = 1000) => {
  const f = new File(["x"], name, { type })
  Object.defineProperty(f, "size", { value: size })
  return f
}

beforeEach(() => {
  post.mockReset()
  getApiRequestUrl.mockClear()
  getCsrfTokenForRequest.mockClear()
  FakeXHR.mode = "ok"
  FakeXHR.last = null
  vi.stubGlobal("XMLHttpRequest", FakeXHR)
})
afterEach(() => vi.unstubAllGlobals())

describe("validateImageFile", () => {
  it("accepts jpeg, png and webp up to the limit", () => {
    for (const type of MEDIA_LIMITS.mimeTypes) expect(validateImageFile(file("x", type))).toBeNull()
    expect(validateImageFile(file("x", "image/png", MEDIA_LIMITS.maxBytes))).toBeNull()
  })

  it("rejects other types and oversize files with a readable reason", () => {
    expect(validateImageFile(file("a.gif", "image/gif"))?.code).toBe("INVALID_TYPE")
    expect(validateImageFile(file("a.pdf", "application/pdf"))?.message).toContain("a.pdf")
    expect(validateImageFile(file("big.jpg", "image/jpeg", MEDIA_LIMITS.maxBytes + 1))?.code).toBe("FILE_TOO_LARGE")
  })
})

describe("uploadMediaFile", () => {
  const presign = () => post.mockResolvedValueOnce({ data: { mediaId: "m1", uploadUrl: "https://r2.test/put", publicUrl: "https://cdn/x.jpg" } })

  it("presigns, uploads with the right headers and progress, then confirms — in that order", async () => {
    presign()
    post.mockResolvedValueOnce({ data: {} })
    const progress: number[] = []

    const result = await uploadMediaFile(file("p.png", "image/png", 2048), "listing_image", {
      onProgress: (p) => progress.push(p),
    })

    expect(result).toEqual({ mediaId: "m1", url: "https://cdn/x.jpg" })
    expect(post.mock.calls[0]).toEqual([
      "/media/presign",
      { purpose: "listing_image", mimeType: "image/png", sizeBytes: 2048, originalFilename: "p.png" },
    ])
    expect(FakeXHR.last).toMatchObject({ method: "PUT", url: "https://r2.test/put" })
    expect(FakeXHR.last!.headers["Content-Type"]).toBe("image/png")
    expect(progress).toEqual([50, 100])
    expect(post.mock.calls[1]![0]).toBe("/media/m1/complete")
  })

  it("uses the authenticated API relay when the backend provides one", async () => {
    post.mockResolvedValueOnce({
      data: {
        mediaId: "m1",
        uploadUrl: "https://r2.test/put",
        proxyUploadPath: "/media/m1/content",
      },
    })

    await uploadMediaFile(file("private.png", "image/png", 2048), "verification_document")

    expect(FakeXHR.last).toMatchObject({
      method: "PUT",
      url: "http://localhost:3002/api/v1/media/m1/content",
      withCredentials: true,
    })
    expect(FakeXHR.last!.headers["X-CSRF-Token"]).toBe("csrf-token")
    expect(FakeXHR.last!.headers["Content-Type"]).toBe("image/png")
    expect(post).toHaveBeenCalledTimes(1)
  })

  it("never calls the API for a file that fails validation", async () => {
    await expect(uploadMediaFile(file("a.gif", "image/gif"), "listing_image")).rejects.toMatchObject({ code: "INVALID_TYPE" })
    expect(post).not.toHaveBeenCalled()
  })

  it("surfaces a storage failure and does NOT confirm the media", async () => {
    presign()
    FakeXHR.mode = "http500"
    await expect(uploadMediaFile(file(), "seller_avatar")).rejects.toMatchObject({ code: "UPLOAD_FAILED" })
    expect(post).toHaveBeenCalledTimes(1)
  })

  it("surfaces a network error", async () => {
    presign()
    FakeXHR.mode = "network"
    await expect(uploadMediaFile(file(), "seller_cover")).rejects.toBeInstanceOf(MediaUploadError)
    expect(post).toHaveBeenCalledTimes(1)
  })

  it("surfaces a failed confirmation instead of pretending it worked", async () => {
    presign()
    post.mockRejectedValueOnce(new Error("complete failed"))
    await expect(uploadMediaFile(file(), "verification_document")).rejects.toThrow("complete failed")
  })

  it("can be cancelled while the file is being sent", async () => {
    presign()
    FakeXHR.mode = "hang"
    const controller = new AbortController()
    const pending = uploadMediaFile(file(), "listing_image", { signal: controller.signal })
    await vi.waitFor(() => expect(FakeXHR.last).not.toBeNull())
    controller.abort()
    await expect(pending).rejects.toMatchObject({ code: "UPLOAD_ABORTED" })
    expect(post).toHaveBeenCalledTimes(1)
  })
})
