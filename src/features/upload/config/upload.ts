/**
 * Upload Configuration
 * 
 * Centralized configuration - NO magic numbers
 * All values can be overridden via environment variables
 */

import {
  DEFAULT_CONCURRENCY,
  DEFAULT_MAX_RETRIES,
  PROGRESS_UPDATE_INTERVAL,
  CANCELLATION_TIMEOUT,
  RETRY_BASE_DELAY,
  RETRY_MAX_DELAY,
  MAX_FILES,
  MAX_FILE_SIZE,
  MIN_FILES,
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  ALLOWED_TYPES,
  STATUS_COLORS,
  HTTP_STATUS,
} from '../types/upload.constants'
import {
  UploadError,
  createNetworkError,
  createUnauthorizedError,
  createFileTooLargeError,
  createInvalidFileTypeError,
  createServerError,
  createAbortedError,
  createHttpError,
} from '../types/upload.error'

export const UPLOAD_CONFIG = {
  // Concurrent Upload Limits
  maxConcurrentUploads: DEFAULT_CONCURRENCY,
  maxRetries: DEFAULT_MAX_RETRIES,

  // Timing
  progressUpdateInterval: PROGRESS_UPDATE_INTERVAL,
  cancellationTimeout: CANCELLATION_TIMEOUT,
  retryBaseDelay: RETRY_BASE_DELAY,
  retryMaxDelay: RETRY_MAX_DELAY,

  // File Validation
  maxFiles: MAX_FILES,
  maxFileSize: MAX_FILE_SIZE,
  minFiles: MIN_FILES,
  allowedTypes: ALLOWED_TYPES,

  // Form Validation
  minTitleLength: MIN_TITLE_LENGTH,
  maxTitleLength: MAX_TITLE_LENGTH,
  minDescriptionLength: MIN_DESCRIPTION_LENGTH,
  maxDescriptionLength: MAX_DESCRIPTION_LENGTH,

  // UI
  statusColors: STATUS_COLORS,

  // HTTP
  httpStatus: HTTP_STATUS,
} as const

// Helper functions
export const isFileTypeAllowed = (file: File): boolean => {
  // Convert readonly array to mutable for includes check
  return UPLOAD_CONFIG.allowedTypes.includes(file.type as typeof UPLOAD_CONFIG.allowedTypes[number])
}

export const isFileSizeValid = (file: File): boolean => {
  return file.size <= UPLOAD_CONFIG.maxFileSize
}

export const formatFileSize = (bytes: number): string => {
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// Validation helpers
export const validateFile = (file: File): { valid: boolean; error?: UploadError } => {
  if (!isFileTypeAllowed(file)) {
    return {
      valid: false,
      error: createInvalidFileTypeError([...UPLOAD_CONFIG.allowedTypes] as string[]),
    }
  }
  
  if (!isFileSizeValid(file)) {
    return {
      valid: false,
      error: createFileTooLargeError(formatFileSize(UPLOAD_CONFIG.maxFileSize)),
    }
  }
  
  return { valid: true }
}

// Export default config
export default UPLOAD_CONFIG