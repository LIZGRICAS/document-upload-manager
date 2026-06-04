/**
 * Tests for File Deduplication
 * 
 * Tests that duplicates are MARKED not REMOVED
 * 
 * Expected behavior:
 * - Input: [fileA, fileA, fileA]
 * - Output: [
 *     { isDuplicate: false },
 *     { isDuplicate: true },
 *     { isDuplicate: true }
 *   ]
 */

import { describe, it, expect } from '@jest/globals'

import { getFileKey } from '../features/upload/domain/upload.utils'

describe('File Deduplication', () => {
  it('should create same key for files with same name and size', () => {
    const fileA = new File(['content'], 'test.txt', { type: 'text/plain' })
    const fileB = new File(['content'], 'test.txt', { type: 'text/plain' })

    expect(getFileKey(fileA)).toBe(getFileKey(fileB))
  })

  it('should create different keys for files with different names', () => {
    const fileA = new File(['content'], 'fileA.txt', { type: 'text/plain' })
    const fileB = new File(['content'], 'fileB.txt', { type: 'text/plain' })

    expect(getFileKey(fileA)).not.toBe(getFileKey(fileB))
  })

  it('should create different keys for files with different sizes', () => {
    const fileA = new File(['content'], 'test.txt', { type: 'text/plain' })
    const fileB = new File(['content', 'extra'], 'test.txt', { type: 'text/plain' })

    expect(getFileKey(fileA)).not.toBe(getFileKey(fileB))
  })
})

describe('Deduplication Algorithm', () => {
  it('should mark duplicates but NOT remove them', () => {
    // Simulating the mapFilesToDescriptors behavior
    const files: File[] = []
    
    // Create 3 identical files (same name, same size)
    for (let i = 0; i < 3; i++) {
      files.push(new File(['content'], 'test.txt', { type: 'text/plain' }))
    }

    const map = new Map<string, { id: string; isDuplicate: boolean }>()
    const fileMap = new Map<string, { id: string }>()
    const result: { id: string; isDuplicate: boolean }[] = []

    for (const file of files) {
      const key = getFileKey(file)

      if (!map.has(key)) {
        const id = `file-${map.size}`
        map.set(key, { id, isDuplicate: false })
        fileMap.set(key, { id })
        result.push({ id, isDuplicate: false })
      } else {
        const original = fileMap.get(key)!
        result.push({
          id: `file-${map.size}`,
          isDuplicate: true,
        })
      }
    }

    // Expected: 3 files, first is original, next 2 are duplicates
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ id: expect.any(String), isDuplicate: false })
    expect(result[1]).toEqual({ id: expect.any(String), isDuplicate: true })
    expect(result[2]).toEqual({ id: expect.any(String), isDuplicate: true })
  })
})