/**
 * Mock Submit API Route
 * 
 * Validates and stores form data with file references
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, files } = body

    // Validation
    if (!title || title.length < 3) {
      return NextResponse.json(
        { error: 'Title must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (!description || description.length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' },
        { status: 400 }
      )
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: 'At least one file is required' },
        { status: 400 }
      )
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock successful response
    return NextResponse.json(
      {
        success: true,
        submissionId: `sub_${Date.now()}`,
        title,
        description,
        files: files.map((f: any) => ({
          id: f.id,
          url: f.url,
          name: f.name,
          status: f.status,
        })),
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