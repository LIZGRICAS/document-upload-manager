/**
 * useUploadQueue Hook
 * 
 * Concurrency management ONLY
 * 
 * Responsibilities:
 * - enqueue jobs
 * - manage concurrency pool
 * - process queue
 * 
 * NO UI, NO Formik, NO validation, NO reducers
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export interface UploadQueueItem {
  id: string
  execute: () => Promise<void>
}

export interface UseUploadQueueResult {
  enqueue: (item: UploadQueueItem) => void
  start: () => void
  pause: () => void
  cancel: (id: string) => void
  isRunning: boolean
  queueSize: number
  activeCount: number
}

export const useUploadQueue = (maxConcurrent = 3): UseUploadQueueResult => {
  const queue = useRef<UploadQueueItem[]>([])
  const activeSlots = useRef<Set<string>>(new Set())
  const [queueSize, setQueueSize] = useState(0)
  const [activeCount, setActiveCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const pausedRef = useRef(false)
  const queueRef = useRef<UploadQueueItem[]>([])
  const activeSlotsRef = useRef<Set<string>>(new Set())

  const processNext = useCallback(() => {
    if (pausedRef.current || activeSlotsRef.current.size >= maxConcurrent) {
      return
    }

    if (queueRef.current.length > 0) {
      const item = queueRef.current.shift()
      if (item) {
        activeSlotsRef.current.add(item.id)
        setActiveCount((prev) => prev + 1)
        setQueueSize((prev) => prev - 1)

        item.execute().finally(() => {
          activeSlotsRef.current.delete(item.id)
          setActiveCount((prev) => Math.max(0, prev - 1))
          processNext()
        })
      }
    }
  }, [maxConcurrent])

  const enqueue = useCallback((item: UploadQueueItem) => {
    queueRef.current.push(item)
    setQueueSize((prev) => prev + 1)
    if (isRunning && !pausedRef.current) {
      processNext()
    }
  }, [isRunning, processNext])

  const start = useCallback(() => {
    setIsRunning(true)
    pausedRef.current = false
    processNext()
  }, [processNext])

  const pause = useCallback(() => {
    pausedRef.current = true
  }, [])

  const cancel = useCallback((id: string) => {
    // Remove from queue
    queueRef.current = queueRef.current.filter((item) => item.id !== id)
    setQueueSize((prev) => prev - 1)
  }, [])

  // Process queue when running and slots available
  useEffect(() => {
    if (isRunning && !pausedRef.current) {
      processNext()
    }
  }, [isRunning, processNext])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel all pending jobs
      queueRef.current = []
      setQueueSize(0)
    }
  }, [])

  return {
    enqueue,
    start,
    pause,
    cancel,
    isRunning,
    queueSize,
    activeCount,
  }
}