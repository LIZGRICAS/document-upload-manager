/**
 * File Upload Feature
 * 
 * Exports all modules for easy imports
 * Follows the architecture: Domain → Infrastructure → State → UI
 */

// Types
export * from './types/upload.types'
export { UploadErrorCode, UploadError } from './types/upload.error'
export * from './types/upload.constants'

// Config
export * from './config/upload'

// Domain
export { isUploading, isDone, isError, isCancelled, isIdle, isDuplicate } from './domain/upload.utils'
export { formatTimestamp, formatTimeAgo, formatBytes, getFileKey } from './domain/upload.utils'

// Services
export * from './services/upload.provider'
export * from './services/backoff'
export * from './services/upload.service'

// Store
export * from './store/upload.context'
export * from './store/upload.actions'
export * from './store/upload.selectors'
export { UploadClientWrapper } from './upload-wrapper.client'

// Hooks
export * from './hooks/useUploadManager'
export * from './hooks/useUploadQueue'
export * from './hooks/useUpload'
export * from './hooks/useDarkMode'

// Components
export * from './components/Dropzone'
export * from './components/FilesTable'
export * from './components/FileRow'
export * from './components/UploadForm'
export * from './components/useDropZone'

// Theme
export * from './theme/theme.context'
export { ThemeProvider } from './theme/theme.context'
export { ThemeClientWrapper } from './theme/theme-provider.client'
export * from './components/ThemeToggle'

// Feature exports
export { useDarkMode } from './hooks/useDarkMode'
