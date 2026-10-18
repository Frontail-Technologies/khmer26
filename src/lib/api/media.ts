import { apiClient, getApiRequestUrl, getCsrfTokenForRequest } from '@/lib/api/client';

export type MediaPurpose =
  | 'listing_image'
  | 'chat_image'
  | 'seller_avatar'
  | 'seller_cover'
  | 'verification_document'
  | 'banner'
  | 'banner_image';

/** Mirrors what the backend accepts (media.schemas.ts): jpeg/png/webp up to 10 MB. */
export const MEDIA_LIMITS = {
  maxBytes: 10 * 1024 * 1024,
  mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

export interface PresignUploadResponse {
  mediaId: string;
  uploadUrl: string;
  proxyUploadPath?: string;
  publicUrl?: string;
}

export type MediaUploadErrorCode =
  | 'INVALID_TYPE'
  | 'FILE_TOO_LARGE'
  | 'UPLOAD_FAILED'
  | 'UPLOAD_ABORTED';

export class MediaUploadError extends Error {
  constructor(
    readonly code: MediaUploadErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'MediaUploadError';
  }
}

/** Returns a user-facing reason the file cannot be uploaded, or null when it is fine. */
export function validateImageFile(file: Pick<File, 'type' | 'size' | 'name'>): MediaUploadError | null {
  if (!(MEDIA_LIMITS.mimeTypes as readonly string[]).includes(file.type)) {
    return new MediaUploadError('INVALID_TYPE', `${file.name}: only JPG, PNG or WebP images are allowed.`);
  }
  if (file.size > MEDIA_LIMITS.maxBytes) {
    return new MediaUploadError('FILE_TOO_LARGE', `${file.name}: images must be 10 MB or smaller.`);
  }
  return null;
}

export interface UploadOptions {
  /** 0–100, reported while the file bytes are sent to storage. */
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

/** PUT with progress (fetch cannot report upload progress). */
function putFile(
  url: string,
  file: File,
  { onProgress, signal }: UploadOptions,
  authentication?: { csrfToken: string }
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    if (authentication) {
      xhr.withCredentials = true;
      xhr.setRequestHeader('X-CSRF-Token', authentication.csrfToken);
    }
    xhr.setRequestHeader('Content-Type', file.type);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
      } else {
        reject(new MediaUploadError('UPLOAD_FAILED', 'The upload to storage failed. Please try again.'));
      }
    };
    xhr.onerror = () => reject(new MediaUploadError('UPLOAD_FAILED', 'Network error while uploading. Please try again.'));
    xhr.onabort = () => reject(new MediaUploadError('UPLOAD_ABORTED', 'Upload cancelled.'));

    if (signal) {
      if (signal.aborted) {
        reject(new MediaUploadError('UPLOAD_ABORTED', 'Upload cancelled.'));
        return;
      }
      signal.addEventListener('abort', () => xhr.abort(), { once: true });
    }
    xhr.send(file);
  });
}

/**
 * Presign -> authenticated API relay (or legacy direct upload) -> completion. Every step's
 * failure is surfaced to the caller; a media record only counts after storage accepted it.
 */
export async function uploadMediaFile(
  file: File,
  purpose: MediaPurpose = 'banner',
  options: UploadOptions = {}
): Promise<{ mediaId: string; url?: string }> {
  const invalid = validateImageFile(file);
  if (invalid) throw invalid;

  const presignRes = await apiClient.post<PresignUploadResponse>('/media/presign', {
    purpose,
    mimeType: file.type,
    sizeBytes: file.size,
    originalFilename: file.name,
  });
  const { mediaId, uploadUrl, proxyUploadPath, publicUrl } = presignRes.data;

  if (proxyUploadPath) {
    const csrfToken = await getCsrfTokenForRequest();
    if (!csrfToken) {
      throw new MediaUploadError('UPLOAD_FAILED', 'Your session could not authorize the upload. Please sign in again.');
    }
    await putFile(getApiRequestUrl(proxyUploadPath), file, options, { csrfToken });
  } else {
    await putFile(uploadUrl, file, options);
    await apiClient.post(`/media/${mediaId}/complete`);
  }

  return { mediaId, url: publicUrl };
}
