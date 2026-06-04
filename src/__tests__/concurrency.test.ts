/**
 * Tests for Concurrency Utilities
 * 
 * Tests limitConcurrency and limitConcurrencySettled
 */

import { describe, it, expect } from '@jest/globals'

import { limitConcurrency, limitConcurrencySettled } from '../lib/concurrency'

describe('limitConcurrency', () => {
  it('should execute tasks with specified concurrency limit', async () => {
    const tasks: Array<() => Promise<number>> = []
    const executionOrder: number[] = []
    let activeTasks = 0
    let maxActiveTasks = 0

    for (let i = 0; i < 5; i++) {
      tasks.push(() => {
        activeTasks++
        maxActiveTasks = Math.max(maxActiveTasks, activeTasks)
        
        return new Promise<number>((resolve) => {
          setTimeout(() => {
            executionOrder.push(i)
            activeTasks--
            resolve(i)
          }, 10)
        })
      })
    }

    const results = await limitConcurrency(tasks, 2)
    
    expect(results).toEqual([0, 1, 2, 3, 4])
    expect(executionOrder).toEqual([0, 1, 2, 3, 4])
    expect(maxActiveTasks).toBeLessThanOrEqual(2)
  })

  it('should preserve order in results', async () => {
    const tasks = [
      () => Promise.resolve(10),
      () => Promise.resolve(20),
      () => Promise.resolve(30),
    ]

    const results = await limitConcurrency(tasks, 3)
    expect(results).toEqual([10, 20, 30])
  })

  it('should handle errors and propagate them', async () => {
    const tasks = [
      () => Promise.resolve('success1'),
      () => Promise.reject(new Error('error')),
      () => Promise.resolve('success2'),
    ]

    const results = await limitConcurrency(tasks, 2)
    
    // Errors are stored in results array
    expect(results[0]).toBe('success1')
    expect(results[2]).toBe('success2')
  })

  it('should work with limit=1 (sequential)', async () => {
    const tasks = [
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3),
    ]

    const results = await limitConcurrency(tasks, 1)
    expect(results).toEqual([1, 2, 3])
  })

  it('should work when pool size > task count', async () => {
    const tasks = [
      () => Promise.resolve(1),
      () => Promise.resolve(2),
    ]

    // Pool of 10 but only 2 tasks
    const results = await limitConcurrency(tasks, 10)
    expect(results).toEqual([1, 2])
  })

  it('should handle empty array', async () => {
    const results = await limitConcurrency([], 3)
    expect(results).toEqual([])
  })
})

describe('limitConcurrencySettled', () => {
  it('should return PromiseSettledResult for all tasks', async () => {
    const tasks = [
      () => Promise.resolve('success'),
      () => Promise.reject(new Error('error')),
      () => Promise.resolve('success2'),
    ]

    const results = await limitConcurrencySettled(tasks, 2)
    
    expect(results).toHaveLength(3)
    expect(results[0]).toEqual({ status: 'fulfilled', value: 'success' })
    expect(results[1]).toEqual({ status: 'rejected', reason: expect.any(Error) })
    expect(results[2]).toEqual({ status: 'fulfilled', value: 'success2' })
  })

  it('should preserve order in results', async () => {
    const tasks = [
      () => Promise.resolve(10),
      () => Promise.resolve(20),
      () => Promise.resolve(30),
    ]

    const results = await limitConcurrencySettled(tasks, 3)
    
    expect(results).toHaveLength(3)
    expect(results[0]).toEqual({ status: 'fulfilled', value: 10 })
    expect(results[1]).toEqual({ status: 'fulfilled', value: 20 })
    expect(results[2]).toEqual({ status: 'fulfilled', value: 30 })
  })
})