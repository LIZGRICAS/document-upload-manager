/**
 * Upload Service
 * 
 * High-level service that coordinates upload operations
 * Uses XHRUploadProvider with retry logic
 */

import type { IUploadProvider, UploadOptions, UploadResult } from './upload.provider'
import { XHRUploadProvider } from './providers/xhr.upload.provider'
import { exponentialBackoff, withRetry, type BackoffOptions } from './backoff'

// Export types
export type { IUploadProvider, UploadOptions, UploadResult } from './upload.provider'
export type { BackoffOptions } from './backoff'
export type { UploadErrorCode, UploadError } from '../types/upload.error'

// Default provider factory
export const createDefaultProvider = (
  allowedTypes: string[],
  maxSize: number
): IUploadProvider => {
  return new XHRUploadProvider({ allowedTypes, maxSize })
}

// Upload service class
export class UploadService {
  private provider: IUploadProvider
  private backoffOptions: BackoffOptions

  constructor(
    provider: IUploadProvider,
    backoffOptions: BackoffOptions = {}
  ) {
    this.provider = provider
    this.backoffOptions = backoffOptions
  }

  /**
   * Upload a file with automatic retries
   */
  async upload(
    file: File,
    options: UploadOptions
  ): Promise<UploadResult> {
    // Calculate retry delay for this attempt
    const currentDelay = exponentialBackoff(
      options.abortSignal ? 0 : 0, // Simplified for now
      this.backoffOptions
    )

    return withRetry(
      () => this.provider.upload(file, options),
      this.backoffOptions
    )
  }

  /**
   * Upload a file without retries (for manual retry control)
   */
  async uploadOnce(
    file: File,
    options: UploadOptions
  ): Promise<UploadResult> {
    return this.provider.upload(file, options)
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.provider.isValidType(file)) {
      return {
        valid: false,
        error: `Tipo de archivo no permitido: ${file.type}`,
      }
    }

    if (!this.provider.isValidSize(file)) {
      return {
        valid: false,
        error: `El archivo es demasiado grande. Máximo: ${this.provider.getMaxSize()} bytes`,
      }
    }

    return { valid: true }
  }

  /**
   * Get the list of allowed file types
   */
  getAllowedTypes(): string[] {
    return this.provider.getAllowedTypes()
  }

  /**
   * Get the maximum file size
   */
  getMaxSize(): number {
    return this.provider.getMaxSize()
  }
}

// Factory function for easy instantiation
export const createUploadService = (
  allowedTypes: string[] = [],
  maxSize: number = 100 * 1024 * 1024,
  backoffOptions: BackoffOptions = {}
): UploadService => {
  const provider = createDefaultProvider(allowedTypes, maxSize)
  return new UploadService(provider, backoffOptions)
}