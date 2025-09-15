import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function GET(request: NextRequest) {
  try {const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const { data, error } = await supabaseServer
      .rpc('get_popular_posts', {
        days_param: days,
        limit_param: limit
      })
    
    if (error) {
      console.error('Popular posts fetch error:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    return NextResponse.json(createSuccessResponse(data || []))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}