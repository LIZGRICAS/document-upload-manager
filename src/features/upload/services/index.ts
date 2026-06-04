/**
 * Services Export for Upload Feature
 */

export type {
  IUploadProvider,
  UploadOptions,
  UploadResult,
} from './upload.provider'

export type { BackoffOptions } from './backoff'

export { XHRUploadProvider } from './providers/xhr.upload.provider'

export {
  exponentialBackoff,
  withRetry,
  createRetryableUpload,
} from './backoff'

export {
  UploadService,
  createUploadService,
  createDefaultProvider,
} from './upload.service'
