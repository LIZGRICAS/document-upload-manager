/**
 * Tests for Upload Configuration
 * 
 * Tests validation helpers and config values
 */

import { describe, it, expect } from '@jest/globals'

import { UPLOAD_CONFIG, validateFile, formatFileSize } from '../features/upload/config/upload'

describe('UPLOAD_CONFIG', () => {
  it('should have correct maxFiles', () => {
    expect(UPLOAD_CONFIG.maxFiles).toBe(10)
  })

  it('should have correct maxFileSize', () => {
    expect(UPLOAD_CONFIG.maxFileSize).toBe(100 * 1024 * 1024) // 100MB
  })

  it('should have correct maxConcurrentUploads', () => {
    expect(UPLOAD_CONFIG.maxConcurrentUploads).toBe(3)
  })

  it('should have correct maxRetries', () => {
    expect(UPLOAD_CONFIG.maxRetries).toBe(3)
  })

  it('should have correct allowedTypes', () => {
    expect(UPLOAD_CONFIG.allowedTypes).toContain('application/pdf')
    expect(UPLOAD_CONFIG.allowedTypes).toContain('image/jpeg')
    expect(UPLOAD_CONFIG.allowedTypes).toContain('image/png')
  })
})

describe('validateFile', () => {
  it('should return valid for allowed file types', () => {
    const pdfFile = new File(['%PDF-1.4'], 'test.pdf', { type: 'application/pdf' })
    const result = validateFile(pdfFile)
    expect(result).toEqual({ valid: true })
  })

  it('should return invalid for disallowed file types', () => {
    const exeFile = new File(['content'], 'test.exe', { type: 'application/x-msdownload' })
    const result = validateFile(exeFile)
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
    expect(result.error?.message).toContain('Tipo de archivo no permitido')
  })

  it('should return invalid for files too large', () => {
    // Create a file with size > 100MB
    const bigContent = new Uint8Array(101 * 1024 * 1024).fill('a'.charCodeAt(0))
    const bigFile = new File([bigContent], 'big.txt', { type: 'text/plain' })
    const result = validateFile(bigFile)
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
    expect(result.error?.message).toContain('El archivo es demasiado grande')
  })
})

describe('formatFileSize', () => {
  it('should format file size correctly', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1500)).toBe('1.46 KB')
    expect(formatFileSize(1048576)).toBe('1 MB')
    expect(formatFileSize(1073741824)).toBe('1 GB')
  })
})