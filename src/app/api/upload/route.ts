/**
 * Mock Upload API Route
 * 
 * Simulates file upload with:
 * - Random delay (1-3 seconds)
 * - 20% error rate
 * - Progress simulation
 */

import { NextRequest, NextResponse } from 'next/server'

// Mock file storage (in-memory for demo)
const fileStore = new Map<string, { url: string; name: string }>()

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Simulate network delay (1-3 seconds)
    const delay = Math.floor(Math.random() * 2000) + 1000
    await new Promise((resolve) => setTimeout(resolve, delay))

    // Simulate 20% error rate
    if (Math.random() < 0.2) {
      return NextResponse.json(
        { error: 'Simulated server error' },
        { status: 500 }
      )
    }

    // Generate mock URL
    const fileUrl = `/api/files/${Date.now()}-${Math.random().toString(36).substring(7)}`
    
    // Store in mock database
    fileStore.set(fileUrl, {
      url: fileUrl,
      name: file.name,
    })

    return NextResponse.json(
      {
        url: fileUrl,
        id: fileUrl,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Return list of uploaded files
  const files = Array.from(fileStore.values())
  return NextResponse.json({ files }, { status: 200 })
}