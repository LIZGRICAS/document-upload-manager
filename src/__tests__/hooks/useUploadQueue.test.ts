/**
 * Tests for useUploadQueue
 * 
 * Tests concurrency management
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { renderHook, act } from '@testing-library/react'
import { useUploadQueue } from '../../features/upload/hooks/useUploadQueue'

describe('useUploadQueue', () => {
  it('should start with empty queue', () => {
    const { result } = renderHook(() => useUploadQueue(3))

    expect(result.current.queueSize).toBe(0)
    expect(result.current.activeCount).toBe(0)
    expect(result.current.isRunning).toBe(false)
  })

  it('should enqueue items', () => {
    const { result } = renderHook(() => useUploadQueue(3))

    act(() => {
      result.current.enqueue({
        id: '1',
        execute: async () => {},
      })
    })

    expect(result.current.queueSize).toBe(1)
  })

  it('should start processing when running', async () => {
    let executed = false

    const { result } = renderHook(() => useUploadQueue(3))

    act(() => {
      result.current.enqueue({
        id: '1',
        execute: async () => {
          executed = true
        },
      })
      result.current.start()
    })

    // Wait for async execution
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(executed).toBe(true)
    expect(result.current.activeCount).toBe(0)
    expect(result.current.queueSize).toBe(0)
  })

  it('should respect maxConcurrent limit', async () => {
    const executionOrder: string[] = []
    const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const { result } = renderHook(() => useUploadQueue(2))

    act(() => {
      result.current.enqueue({
        id: '1',
        execute: async () => {
          executionOrder.push('1-start')
          await pause(10)
          executionOrder.push('1-end')
        },
      })
      result.current.enqueue({
        id: '2',
        execute: async () => {
          executionOrder.push('2-start')
          await pause(10)
          executionOrder.push('2-end')
        },
      })
      result.current.enqueue({
        id: '3',
        execute: async () => {
          executionOrder.push('3-start')
          await pause(10)
          executionOrder.push('3-end')
        },
      })
      result.current.start()
    })

    // Wait for all to complete
    await new Promise((resolve) => setTimeout(resolve, 50))

    // First 2 should start together, then 3 after one finishes
    expect(executionOrder[0]).toBe('1-start')
    expect(executionOrder[1]).toBe('2-start')
    expect(['3-start', '1-end', '2-end']).toContain(executionOrder[2])
  })

  it('should pause and resume', async () => {
    let executed = false

    const { result } = renderHook(() => useUploadQueue(3))

    act(() => {
      result.current.enqueue({
        id: '1',
        execute: async () => {
          executed = true
        },
      })
      result.current.pause()
    })

    // Nothing should execute while paused
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(executed).toBe(false)

    // Resume should process
    act(() => {
      result.current.start()
    })

    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(executed).toBe(true)
  })

  it('should cancel pending items', () => {
    const { result } = renderHook(() => useUploadQueue(3))

    act(() => {
      result.current.enqueue({ id: '1', execute: async () => {} })
      result.current.enqueue({ id: '2', execute: async () => {} })
      result.current.cancel('1')
    })

    expect(result.current.queueSize).toBe(1)
  })
})