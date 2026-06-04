/**
 * Types Export for Upload Feature
 */

export type { UploadStatus } from './upload.types'
export type {
  BaseUploadJob,
  IdleUploadJob,
  UploadingUploadJob,
  DoneUploadJob,
  ErrorUploadJob,
  CancelledUploadJob,
  DuplicateUploadJob,
  UploadJob,
  UploadResponse,
  FileDescriptor,
} from './upload.types'

export {
  UploadErrorCode,
  UploadError,
  createNetworkError,
  createUnauthorizedError,
  createFileTooLargeError,
  createInvalidFileTypeError,
  createServerError,
  createAbortedError,
  createHttpError,
} from './upload.error'

export { DEFAULT_CONCURRENCY, DEFAULT_MAX_RETRIES } from './upload.constants'