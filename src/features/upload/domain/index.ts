/**
 * Domain Export for Upload Feature
 */

export type { UploadJob } from '../types/upload.types'
export { isUploading, isDone, isError, isCancelled, isIdle, isDuplicate } from './upload.utils'
export { getProgress, getStatusText, formatTimestamp, formatTimeAgo, formatBytes, getFileKey } from './upload.utils'

// Re-export UploadError for convenience
export { UploadErrorCode, UploadError } from '../types/upload.error'
export type { UploadError as UploadErrorType } from '../types/upload.error'