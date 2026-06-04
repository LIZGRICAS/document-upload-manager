/**
 * Upload Client Wrapper
 * 
 * Client component that wraps UploadProvider
 * Allows Server Components to import from index without client-side errors
 */

'use client'

import React from 'react'
import { UploadProvider } from './store'

interface UploadClientWrapperProps {
  children: React.ReactNode
}

export const UploadClientWrapper: React.FC<UploadClientWrapperProps> = ({ children }) => {
  return (
    <UploadProvider>
      {children}
    </UploadProvider>
  )
}
