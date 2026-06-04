/**
 * Tests for Upload Types (Discriminated Unions)
 * 
 * Tests type narrowing and compile-time safety
 */

import { describe, it, expect } from '@jest/globals'

// Importamos los tipos y type guards
import type {
  UploadJob,
  IdleUploadJob,
  UploadingUploadJob,
  DoneUploadJob,
  ErrorUploadJob,
  CancelledUploadJob,
  DuplicateUploadJob,
} from '../features/upload/types/upload.types'

import {
  isUploading,
  isDone,
  isError,
  isCancelled,
  isIdle,
  isDuplicate,
  getProgress,
  getStatusText,
} from '../features/upload/domain/upload.utils'

describe('Discriminated Unions - Type Safety', () => {
  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' })

  describe('isIdle', () => {
    it('should narrow type to IdleUploadJob', () => {
      const job: IdleUploadJob = {
        id: '1',
        file: mockFile,
        status: 'idle',
        createdAt: new Date(),
        retryCount: 0,
        isDuplicate: false,
      }

      if (isIdle(job)) {
        // TypeScript knows job is IdleUploadJob here
        expect(job.status).toBe('idle')
        expect(job.progress).toBeUndefined()
        expect(job.error).toBeUndefined()
        expect(job.url).toBeUndefined()
      }
    })
  })

  describe('isUploading', () => {
    it('should narrow type to UploadingUploadJob', () => {
      const job: UploadingUploadJob = {
        id: '2',
        file: mockFile,
        status: 'uploading',
        createdAt: new Date(),
        retryCount: 0,
        progress: 50,
        isDuplicate: false,
      }

      if (isUploading(job)) {
        // TypeScript knows job is UploadingUploadJob here
        expect(job.status).toBe('uploading')
        expect(job.progress).toBe(50)
        expect(job.error).toBeUndefined()
        expect(job.url).toBeUndefined()
      }
    })
  })

  describe('isDone', () => {
    it('should narrow type to DoneUploadJob', () => {
      const job: DoneUploadJob = {
        id: '3',
        file: mockFile,
        status: 'done',
        createdAt: new Date(),
        retryCount: 0,
        progress: 100,
        url: 'https://example.com/file.txt',
        isDuplicate: false,
      }

      if (isDone(job)) {
        // TypeScript knows job is DoneUploadJob here
        expect(job.status).toBe('done')
        expect(job.progress).toBe(100)
        expect(job.url).toBe('https://example.com/file.txt')
        expect(job.error).toBeUndefined()
      }
    })
  })

  describe('isError', () => {
    it('should narrow type to ErrorUploadJob', () => {
      const job: ErrorUploadJob = {
        id: '4',
        file: mockFile,
        status: 'error',
        createdAt: new Date(),
        retryCount: 0,
        progress: 75,
        error: 'Network error',
        isDuplicate: false,
      }

      if (isError(job)) {
        // TypeScript knows job is ErrorUploadJob here
        expect(job.status).toBe('error')
        expect(job.progress).toBe(75)
        expect(job.error).toBe('Network error')
        expect(job.url).toBeUndefined()
      }
    })
  })

  describe('isCancelled', () => {
    it('should narrow type to CancelledUploadJob', () => {
      const job: CancelledUploadJob = {
        id: '5',
        file: mockFile,
        status: 'cancelled',
        createdAt: new Date(),
        retryCount: 0,
        progress: 30,
        isDuplicate: false,
      }

      if (isCancelled(job)) {
        // TypeScript knows job is CancelledUploadJob here
        expect(job.status).toBe('cancelled')
        expect(job.progress).toBe(30)
        expect(job.error).toBeUndefined()
        expect(job.url).toBeUndefined()
      }
    })
  })

  describe('getProgress', () => {
    it('should return progress for uploading jobs', () => {
      const job: UploadingUploadJob = {
        id: '6',
        file: mockFile,
        status: 'uploading',
        createdAt: new Date(),
        retryCount: 0,
        progress: 75,
        isDuplicate: false,
      }
      expect(getProgress(job)).toBe(75)
    })

    it('should return 100 for done jobs', () => {
      const job: DoneUploadJob = {
        id: '7',
        file: mockFile,
        status: 'done',
        createdAt: new Date(),
        retryCount: 0,
        progress: 100,
        url: 'https://example.com/file.txt',
        isDuplicate: false,
      }
      expect(getProgress(job)).toBe(100)
    })

    it('should return last progress for error jobs', () => {
      const job: ErrorUploadJob = {
        id: '8',
        file: mockFile,
        status: 'error',
        createdAt: new Date(),
        retryCount: 0,
        progress: 75,
        error: 'Network error',
        isDuplicate: false,
      }
      expect(getProgress(job)).toBe(75)
    })

    it('should return null for idle jobs', () => {
      const job: IdleUploadJob = {
        id: '9',
        file: mockFile,
        status: 'idle',
        createdAt: new Date(),
        retryCount: 0,
        isDuplicate: false,
      }
      expect(getProgress(job)).toBeNull()
    })
  })

  describe('getStatusText', () => {
    it('should return correct text for each status', () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      
      expect(getStatusText({
        id: '1' as string,
        file: mockFile,
        status: 'idle' as const,
        createdAt: new Date(),
        retryCount: 0,
        isDuplicate: false,
      })).toBe('Pendiente')
      
      expect(getStatusText({
        id: '2' as string,
        file: mockFile,
        status: 'uploading' as const,
        createdAt: new Date(),
        retryCount: 0,
        progress: 50,
        isDuplicate: false,
      })).toBe('Subiendo')
      
      expect(getStatusText({
        id: '3' as string,
        file: mockFile,
        status: 'done' as const,
        createdAt: new Date(),
        retryCount: 0,
        progress: 100,
        url: 'url' as string,
        isDuplicate: false,
      })).toBe('Completado')
      
      expect(getStatusText({
        id: '4' as string,
        file: mockFile,
        status: 'error' as const,
        createdAt: new Date(),
        retryCount: 0,
        progress: 75,
        error: 'err' as string,
        isDuplicate: false,
      })).toBe('Error')
      
      expect(getStatusText({
        id: '5' as string,
        file: mockFile,
        status: 'cancelled' as const,
        createdAt: new Date(),
        retryCount: 0,
        progress: 30,
        isDuplicate: false,
      })).toBe('Cancelado')
    })
  })

  describe('isDuplicate', () => {
    it('should identify duplicate jobs', () => {
      const duplicateJob: DuplicateUploadJob = {
        id: '10',
        file: mockFile,
        status: 'idle',
        createdAt: new Date(),
        retryCount: 0,
        isDuplicate: true,
        originalFileId: 'original-123',
      }

      expect(isDuplicate(duplicateJob)).toBe(true)
      expect(isIdle(duplicateJob)).toBe(true)
    })
  })
})