/**
 * Upload Provider Interface
 * 
 * Contract for upload implementations (XHR, Fetch, etc.)
 * Follows Single Responsibility Principle
 */

import type { UploadJob } from '../types/upload.types'
import type { UploadError } from '../types/upload.error'

export interface UploadOptions {
  title: string
  description: string
  onProgress: (progress: number) => void
  abortSignal?: AbortSignal
}

export interface UploadResult {
  url: string
  id: string
}

export interface IUploadProvider {
  /**
   * Upload a file to the server
   * @param file The file to upload
   * @param options Upload options including progress callback and abort signal
   * @returns Promise with URL and ID
   */
  upload(file: File, options: UploadOptions): Promise<UploadResult>

  /**
   * Cancel an upload in progress
   * @param abortController The AbortController to cancel
   */
  cancel(abortController: AbortController): void

  /**
   * Validate if file type is allowed
   * @param file The file to validate
   * @returns true if file type is allowed
   */
  isValidType(file: File): boolean

  /**
   * Validate if file size is within limits
   * @param file The file to validate
   * @returns true if file size is valid
   */
  isValidSize(file: File): boolean

  /**
   * Get the maximum allowed file size
   */
  getMaxSize(): number

  /**
   * Get the list of allowed MIME types
   */
  getAllowedTypes(): string[]
}