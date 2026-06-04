/**
 * Backoff Strategy
 * 
 * Exponential backoff with jitter for retry logic
 * Avoids "thundering herd" problems
 */

import type { IUploadProvider, UploadOptions } from './upload.provider'

export interface BackoffOptions {
  baseDelay?: number
  maxDelay?: number
  maxRetries?: number
}

export const exponentialBackoff = (
  attempt: number,
  options: BackoffOptions = {}
): number => {
  const {
    baseDelay = 1000,
    maxDelay = 30000,
    maxRetries = 3,
  } = options

  if (attempt >= maxRetries) {
    return -1 // Signal to stop retrying
  }

  // Calculate delay with exponential backoff
  const delay = baseDelay * Math.pow(2, attempt)
  
  // Add jitter (0-1000ms) to prevent thundering herd
  const jitter = Math.random() * 1000
  
  // Clamp to maxDelay
  return Math.min(delay + jitter, maxDelay)
}

/**
 * Retry decorator for async operations with exponential backoff
 * 
 * @param fn The async function to retry
 * @param options Backoff options
 * @param maxAttempts Maximum number of attempts (including initial)
 * @returns The result of the successful operation
 * @throws The last error if all retries fail
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: BackoffOptions = {},
  maxAttempts = 3
): Promise<T> => {
  let lastError: Error | undefined

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // Don't retry if we've exhausted retries
      if (attempt >= maxAttempts - 1) {
        break
      }

      // Get backoff delay
      const delay = exponentialBackoff(attempt, options)
      
      if (delay < 0) {
        break
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Factory function to create a retryable upload function
 * 
 * @param provider The upload provider
 * @param options Backoff options
 * @returns A function that can be called with file and options
 */
export const createRetryableUpload = (
  provider: IUploadProvider,
  options: BackoffOptions = {}
) => {
  return (file: File, uploadOptions: UploadOptions) => {
    return withRetry(
      () => provider.upload(file, uploadOptions),
      options
    )
  }
}