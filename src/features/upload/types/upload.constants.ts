/**
 * Constants for File Upload Feature
 * Centralized configuration - NO magic numbers
 */

// Concurrent Upload Limits
export const DEFAULT_CONCURRENCY = 3 as const
export const DEFAULT_MAX_RETRIES = 3 as const

// Timing
export const PROGRESS_UPDATE_INTERVAL = 100 as const // ms
export const CANCELLATION_TIMEOUT = 5000 as const // ms
export const RETRY_BASE_DELAY = 1000 as const // ms
export const RETRY_MAX_DELAY = 30000 as const // ms

// File Validation
export const MAX_FILES = 10
export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
export const MIN_FILES = 1

// Form Validation
export const MIN_TITLE_LENGTH = 3 as const
export const MAX_TITLE_LENGTH = 100 as const
export const MIN_DESCRIPTION_LENGTH = 10 as const
export const MAX_DESCRIPTION_LENGTH = 500 as const

// Allowed MIME Types
export const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
] as const

// Status Colors (for UI)
export const STATUS_COLORS = {
  idle: 'bg-gray-500',
  uploading: 'bg-blue-500',
  done: 'bg-green-500',
  error: 'bg-red-500',
  cancelled: 'bg-gray-400',
  duplicate: 'bg-yellow-500',
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
} as const