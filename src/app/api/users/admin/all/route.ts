import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function GET(_request: NextRequest) {
  try {// TODO: Add admin authorization check here
    
    const { data, error } = await supabaseServer
      .from('member')
      .select('id, email, name, nickname, role, created_at, deleted_at')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('All users fetch error:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    return NextResponse.json(createSuccessResponse({ users: data || [] }))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}