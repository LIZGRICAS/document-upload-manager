/**
 * Store Export for Upload Feature
 */

// Types
export type { UploadJob, UploadStatus } from '../types/upload.types'

// Actions
export type {
  UploadAction,
  AddFilesAction,
  RemoveFileAction,
  ClearFilesAction,
  StartUploadAction,
  StartAllUploadsAction,
  SetProgressAction,
  SetCompletedAction,
  SetErrorAction,
  CancelUploadAction,
  SetCancelledAction,
  RetryUploadAction,
} from './upload.actions'

// Reducer
export { uploadReducer } from './upload.reducer'

// Context
export { UploadProvider, useUploadContext } from './upload.context'

// Selectors
export type { UploadState } from './upload.reducer'
export * from './upload.selectors'

// Hooks for derived state
export {
  useUploadJobs,
  usePendingCount,
  useCompletedCount,
  useFailedCount,
  useHasErrors,
} from './upload.context'