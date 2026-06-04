/**
 * Tests for Upload Reducer
 * 
 * Tests state transitions and reducer logic
 */

import { describe, it, expect } from '@jest/globals'

import { uploadReducer } from '../../features/upload/store'
import type { UploadJob, IdleUploadJob, UploadingUploadJob, ErrorUploadJob, DoneUploadJob } from '../../features/upload/types'

// Helper to create idle jobs (satisfies discriminated union)
const createIdleJob = (): IdleUploadJob => ({
  id: crypto.randomUUID(),
  file: new File(['test'], 'test.txt', { type: 'text/plain' }),
  status: 'idle' as const,
  createdAt: new Date(),
  retryCount: 0,
  isDuplicate: false,
})

// Helper to create uploading jobs (satisfies discriminated union)
const createUploadingJob = (progress: number = 0): UploadingUploadJob => ({
  id: crypto.randomUUID(),
  file: new File(['test'], 'test.txt', { type: 'text/plain' }),
  status: 'uploading' as const,
  createdAt: new Date(),
  retryCount: 0,
  isDuplicate: false,
  progress,
})

// Helper to create error jobs (satisfies discriminated union)
const createErrorJob = (progress: number = 50, error: string = 'Network error'): ErrorUploadJob => ({
  id: crypto.randomUUID(),
  file: new File(['test'], 'test.txt', { type: 'text/plain' }),
  status: 'error' as const,
  createdAt: new Date(),
  retryCount: 0,
  isDuplicate: false,
  progress,
  error,
})

// Helper to create done jobs (satisfies discriminated union)
const createDoneJob = (url: string = 'https://example.com/file.txt'): DoneUploadJob => ({
  id: crypto.randomUUID(),
  file: new File(['test'], 'test.txt', { type: 'text/plain' }),
  status: 'done' as const,
  createdAt: new Date(),
  retryCount: 0,
  isDuplicate: false,
  progress: 100,
  url,
})

describe('uploadReducer - ADD_FILES', () => {
  it('should add files to state', () => {
    const initialState = { jobs: [] as UploadJob[] }
    const files = [
      new File(['content1'], 'file1.txt', { type: 'text/plain' }),
      new File(['content2'], 'file2.txt', { type: 'text/plain' }),
    ]

    const result = uploadReducer(initialState, {
      type: 'ADD_FILES',
      payload: { files },
    })

    expect(result.jobs).toHaveLength(2)
    expect(result.jobs[0]?.status).toBe('idle')
    expect(result.jobs[0]?.isDuplicate).toBe(false)
  })
})

describe('uploadReducer - DUPLICATE DETECTION', () => {
  it('should mark duplicate files', () => {
    const initialState = { jobs: [] as UploadJob[] }

    const file1 = new File(['content'], 'test.txt', { type: 'text/plain' })
    const file2 = new File(['content'], 'test.txt', { type: 'text/plain' })

    // Add first file
    let state = uploadReducer(initialState, {
      type: 'ADD_FILES',
      payload: { files: [file1] },
    })

    // Add second file (duplicate)
    state = uploadReducer(state, {
      type: 'ADD_FILES',
      payload: { files: [file2] },
    })

    expect(state.jobs).toHaveLength(2)
    expect(state.jobs[0]?.isDuplicate).toBe(false)
    expect(state.jobs[1]?.isDuplicate).toBe(true)
  })
})

describe('uploadReducer - REMOVE_FILE', () => {
  it('should remove a file by id', () => {
    const initialState = { jobs: [createIdleJob()] }

    const result = uploadReducer(initialState, {
      type: 'REMOVE_FILE',
      payload: { id: initialState.jobs[0]?.id || '' },
    })

    expect(result.jobs).toHaveLength(0)
  })
})

describe('uploadReducer - CLEAR_FILES', () => {
  it('should clear all files', () => {
    const initialState = {
      jobs: [createIdleJob(), createIdleJob(), createIdleJob()],
    }

    const result = uploadReducer(initialState, {
      type: 'CLEAR_FILES',
    })

    expect(result.jobs).toHaveLength(0)
  })
})

describe('uploadReducer - START_UPLOAD', () => {
  it('should start upload for a specific file', () => {
    const initialState = { jobs: [createIdleJob()] }

    const result = uploadReducer(initialState, {
      type: 'START_UPLOAD',
      payload: { id: initialState.jobs[0]?.id || '' },
    })

    expect(result.jobs[0]?.status).toBe('uploading')
    expect(result.jobs[0]?.retryCount).toBe(1)
  })
})

describe('uploadReducer - START_ALL_UPLOADS', () => {
  it('should start all idle uploads', () => {
    const initialState = {
      jobs: [createIdleJob(), createIdleJob(), createIdleJob()],
    }

    const result = uploadReducer(initialState, {
      type: 'START_ALL_UPLOADS',
    })

    expect(result.jobs.filter((j) => j.status === 'uploading')).toHaveLength(3)
  })
})

describe('uploadReducer - SET_PROGRESS', () => {
  it('should update progress', () => {
    const initialState = { 
      jobs: [createUploadingJob(0)] 
    }

    const result = uploadReducer(initialState, {
      type: 'SET_PROGRESS',
      payload: { id: initialState.jobs[0]?.id || '', progress: 50 },
    })

    expect(result.jobs[0]?.progress).toBe(50)
  })
})

describe('uploadReducer - SET_COMPLETED', () => {
  it('should mark file as done', () => {
    const initialState = { 
      jobs: [createUploadingJob(100)] 
    }

    const result = uploadReducer(initialState, {
      type: 'SET_COMPLETED',
      payload: { id: initialState.jobs[0]?.id || '', url: 'https://example.com/file.txt' },
    })

    expect(result.jobs[0]?.status).toBe('done')
    expect(result.jobs[0]?.url).toBe('https://example.com/file.txt')
  })
})

describe('uploadReducer - SET_ERROR', () => {
  it('should set error state', () => {
    const initialState = { 
      jobs: [createUploadingJob(50)] 
    }

    const result = uploadReducer(initialState, {
      type: 'SET_ERROR',
      payload: { id: initialState.jobs[0]?.id || '', error: 'Network error' },
    })

    expect(result.jobs[0]?.status).toBe('error')
    expect(result.jobs[0]?.error).toBe('Network error')
    expect(result.jobs[0]?.progress).toBe(50)
  })
})

describe('uploadReducer - CANCEL_UPLOAD', () => {
  it('should cancel upload', () => {
    const initialState = { 
      jobs: [createUploadingJob(50)] 
    }

    const result = uploadReducer(initialState, {
      type: 'CANCEL_UPLOAD',
      payload: { id: initialState.jobs[0]?.id || '' },
    })

    expect(result.jobs[0]?.status).toBe('cancelled')
    expect(result.jobs[0]?.progress).toBe(50)
  })
})

describe('uploadReducer - RETRY_UPLOAD', () => {
  it('should reset to idle for retry', () => {
    const initialState = { 
      jobs: [createErrorJob(50, 'Network error')] 
    }

    const result = uploadReducer(initialState, {
      type: 'RETRY_UPLOAD',
      payload: { id: initialState.jobs[0]?.id || '' },
    })

    expect(result.jobs[0]?.status).toBe('idle')
    expect(result.jobs[0]?.retryCount).toBe(1)
  })
})