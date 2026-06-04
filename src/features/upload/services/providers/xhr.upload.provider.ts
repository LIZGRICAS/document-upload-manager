/**
 * XHR Upload Provider
 * 
 * Concrete implementation of IUploadProvider using XMLHttpRequest
 */

import { IUploadProvider, UploadOptions, UploadResult } from '../upload.provider'
import { UploadErrorCode, UploadError, createHttpError } from '../../types/upload.error'

export class XHRUploadProvider implements IUploadProvider {
  private readonly allowedTypes: string[]
  private readonly maxSize: number

  constructor(config: { allowedTypes: string[]; maxSize: number }) {
    this.allowedTypes = config.allowedTypes
    this.maxSize = config.maxSize
  }

  async upload(file: File, options: UploadOptions): Promise<UploadResult> {
    // Validate file before upload
    if (!this.isValidSize(file)) {
      throw new UploadError(
        UploadErrorCode.FILE_TOO_LARGE,
        `El archivo excede el tamaño máximo de ${this.maxSize} bytes`
      )
    }

    if (!this.isValidType(file)) {
      throw new UploadError(
        UploadErrorCode.INVALID_FILE_TYPE,
        `Tipo de archivo no permitido: ${file.type}`
      )
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const abortController = new AbortController()

      // Handle abort signal
      if (options.abortSignal) {
        options.abortSignal.addEventListener('abort', () => {
          abortController.abort()
          xhr.abort()
          reject(new UploadError(UploadErrorCode.ABORTED, 'Upload cancelado'))
        })
      }

      xhr.open('POST', '/api/upload', true)

      // Progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          options.onProgress(progress)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText) as UploadResult
            resolve(result)
          } catch (e) {
            reject(createHttpError(500))
          }
        } else {
          // Handle HTTP errors with typed errors
          switch (xhr.status) {
            case 401:
              reject(createHttpError(401))
              break
            case 413:
              reject(createHttpError(413))
              break
            case 500:
              reject(createHttpError(500))
              break
            default:
              reject(createHttpError(xhr.status))
          }
        }
      }

      xhr.onerror = () => {
        reject(new UploadError(UploadErrorCode.NETWORK, 'Error de red'))
      }

      xhr.onabort = () => {
        reject(new UploadError(UploadErrorCode.ABORTED, 'Upload cancelado'))
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', options.title)
      formData.append('description', options.description)

      xhr.send(formData)
    })
  }

  cancel(abortController: AbortController): void {
    abortController.abort()
  }

  isValidType(file: File): boolean {
    return this.allowedTypes.includes(file.type)
  }

  isValidSize(file: File): boolean {
    return file.size <= this.maxSize
  }

  getMaxSize(): number {
    return this.maxSize
  }

  getAllowedTypes(): string[] {
    return this.allowedTypes
  }
}