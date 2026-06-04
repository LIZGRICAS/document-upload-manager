/**
 * Tests for Upload Context
 * 
 * Tests context provider and selectors
 */

import { describe, it, expect } from '@jest/globals'
import { renderHook, act } from '@testing-library/react'
import { UploadProvider, useUploadContext, useUploadJobs } from '../../features/upload'

describe('UploadContext', () => {
  it('should provide initial state', () => {
    const { result } = renderHook(
      () => useUploadContext(),
      { wrapper: UploadProvider }
    )

    expect(result.current.jobs).toEqual([])
    expect(result.current.isUploading).toBe(false)
    expect(result.current.pendingCount).toBe(0)
    expect(result.current.completedCount).toBe(0)
    expect(result.current.failedCount).toBe(0)
    expect(result.current.hasErrors).toBe(false)
  })

  it('should add files via addFiles', () => {
    const { result } = renderHook(
      () => useUploadContext(),
      { wrapper: UploadProvider }
    )

    act(() => {
      result.current.addFiles([new File(['test'], 'file1.txt', { type: 'text/plain' })])
    })

    expect(result.current.jobs).toHaveLength(1)
    expect(result.current.jobs[0]?.status).toBe('idle')
  })

  it('should remove files via removeFile', () => {
    const { result } = renderHook(
      () => useUploadContext(),
      { wrapper: UploadProvider }
    )

    act(() => {
      result.current.addFiles([new File(['test'], 'file1.txt', { type: 'text/plain' })])
    })

    const jobId = result.current.jobs[0]?.id || ''
    act(() => {
      result.current.removeFile(jobId)
    })

    expect(result.current.jobs).toHaveLength(0)
  })

  it('should calculate pendingCount correctly', () => {
    const { result } = renderHook(
      () => useUploadContext(),
      { wrapper: UploadProvider }
    )

    act(() => {
      result.current.addFiles([
        new File(['test'], 'file1.txt', { type: 'text/plain' }),
        new File(['test'], 'file2.txt', { type: 'text/plain' }),
      ])
    })

    expect(result.current.pendingCount).toBe(2)

    // Start one upload
    act(() => {
      const jobId = result.current.jobs[0]?.id
      if (jobId) {
        result.current.startUpload(jobId)
      }
    })

    // Wait for state update
    act(() => {})

    // pendingCount includes both 'idle' and 'uploading' jobs
    expect(result.current.pendingCount).toBe(2)
  })

  it('should calculate completedCount correctly', () => {
    const { result } = renderHook(
      () => useUploadContext(),
      { wrapper: UploadProvider }
    )

    act(() => {
      result.current.addFiles([new File(['test'], 'file1.txt', { type: 'text/plain' })])
    })

    const jobId = result.current.jobs[0]?.id || ''
    act(() => {
      result.current.startUpload(jobId)
    })
    act(() => {
      result.current.setCompleted(jobId, 'https://example.com/file.txt')
    })

    expect(result.current.completedCount).toBe(1)
    expect(result.current.pendingCount).toBe(0)
  })

  it('should calculate failedCount correctly', () => {
    const { result } = renderHook(
      () => useUploadContext(),
      { wrapper: UploadProvider }
    )

    act(() => {
      result.current.addFiles([new File(['test'], 'file1.txt', { type: 'text/plain' })])
    })

    const jobId = result.current.jobs[0]?.id || ''
    act(() => {
      result.current.startUpload(jobId)
    })
    act(() => {
      result.current.setError(jobId, 'Network error')
    })

    expect(result.current.failedCount).toBe(1)
    expect(result.current.hasErrors).toBe(true)
  })

  it('should clear all files', () => {
    const { result } = renderHook(
      () => useUploadContext(),
      { wrapper: UploadProvider }
    )

    act(() => {
      result.current.addFiles([
        new File(['test'], 'file1.txt', { type: 'text/plain' }),
        new File(['test'], 'file2.txt', { type: 'text/plain' }),
      ])
    })

    act(() => {
      result.current.clearFiles()
    })

    expect(result.current.jobs).toHaveLength(0)
  })
})

describe('useUploadJobs Hook', () => {
  it('should return jobs from context', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <UploadProvider>{children}</UploadProvider>
    )

    // Use a single wrapper for both hooks
    const { result } = renderHook(
      () => {
        const context = useUploadContext()
        const jobs = useUploadJobs()
        return { context, jobs }
      },
      { wrapper }
    )

    // Add files through context
    act(() => {
      result.current.context.addFiles([new File(['test'], 'file1.txt', { type: 'text/plain' })])
    })

    // Now check useUploadJobs
    expect(result.current.jobs).toHaveLength(1)
  })
})