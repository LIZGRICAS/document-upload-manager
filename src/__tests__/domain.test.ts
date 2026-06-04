/**
 * Tests for Domain Helpers
 * 
 * Tests type guards, formatting, and utility functions
 */

import { describe, it, expect } from '@jest/globals'

import {
  formatBytes,
  formatTimestamp,
  formatTimeAgo,
  getFileKey,
  getProgress,
  getStatusText,
} from '../features/upload/domain/upload.utils'

describe('formatBytes', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1048576)).toBe('1 MB')
    expect(formatBytes(1073741824)).toBe('1 GB')
  })

  it('should support decimal places', () => {
    expect(formatBytes(1500, 2)).toBe('1.46 KB')
    expect(formatBytes(1500, 1)).toBe('1.5 KB')
  })
})

describe('formatTimestamp', () => {
  it('should format date correctly', () => {
    const date = new Date('2026-01-15T10:30:45')
    const result = formatTimestamp(date)
    expect(result).toContain('2026')
    expect(result).toContain('01')
    expect(result).toContain('15')
    expect(result).toContain('10:30:45')
  })
})

describe('formatTimeAgo', () => {
  it('should show seconds ago for recent dates', () => {
    const date = new Date()
    date.setSeconds(date.getSeconds() - 5)
    const result = formatTimeAgo(date)
    expect(result).toContain('5s')
  })

  it('should show minutes ago for minutes-old dates', () => {
    const date = new Date()
    date.setMinutes(date.getMinutes() - 5)
    const result = formatTimeAgo(date)
    expect(result).toContain('5m')
  })

  it('should show hours ago for hours-old dates', () => {
    const date = new Date()
    date.setHours(date.getHours() - 2)
    const result = formatTimeAgo(date)
    expect(result).toContain('2h')
  })

  it('should show days ago for days-old dates', () => {
    const date = new Date()
    date.setDate(date.getDate() - 3)
    const result = formatTimeAgo(date)
    expect(result).toContain('3d')
  })
})

describe('getFileKey', () => {
  it('should create unique key based on name and size', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    const key = getFileKey(file)
    expect(key).toBe('test.txt-7')
  })

  it('should return same key for files with same name and size', () => {
    const file1 = new File(['content'], 'test.txt', { type: 'text/plain' })
    const file2 = new File(['content'], 'test.txt', { type: 'text/plain' })
    expect(getFileKey(file1)).toBe(getFileKey(file2))
  })
})

describe('getProgress', () => {
  it('should return progress for uploading jobs', () => {
    const job: any = {
      id: '1',
      file: new File(['test'], 'test.txt', { type: 'text/plain' }),
      status: 'uploading',
      createdAt: new Date(),
      retryCount: 0,
      progress: 75,
      isDuplicate: false,
    }
    expect(getProgress(job)).toBe(75)
  })

  it('should return 100 for done jobs', () => {
    const job: any = {
      id: '2',
      file: new File(['test'], 'test.txt', { type: 'text/plain' }),
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
    const job: any = {
      id: '3',
      file: new File(['test'], 'test.txt', { type: 'text/plain' }),
      status: 'error',
      createdAt: new Date(),
      retryCount: 0,
      progress: 50,
      error: 'Network error',
      isDuplicate: false,
    }
    expect(getProgress(job)).toBe(50)
  })

  it('should return null for idle jobs', () => {
    const job: any = {
      id: '4',
      file: new File(['test'], 'test.txt', { type: 'text/plain' }),
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
      id: '1', file: mockFile, status: 'idle', createdAt: new Date(), retryCount: 0, isDuplicate: false,
    } as any)).toBe('Pendiente')
    
    expect(getStatusText({
      id: '2', file: mockFile, status: 'uploading', createdAt: new Date(), retryCount: 0, progress: 50, isDuplicate: false,
    } as any)).toBe('Subiendo')
    
    expect(getStatusText({
      id: '3', file: mockFile, status: 'done', createdAt: new Date(), retryCount: 0, progress: 100, url: 'url', isDuplicate: false,
    } as any)).toBe('Completado')
    
    expect(getStatusText({
      id: '4', file: mockFile, status: 'error', createdAt: new Date(), retryCount: 0, progress: 75, error: 'err', isDuplicate: false,
    } as any)).toBe('Error')
    
    expect(getStatusText({
      id: '5', file: mockFile, status: 'cancelled', createdAt: new Date(), retryCount: 0, progress: 30, isDuplicate: false,
    } as any)).toBe('Cancelado')
  })
})