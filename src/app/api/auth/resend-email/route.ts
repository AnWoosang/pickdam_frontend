import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { ROUTES } from '@/app/router/routes'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function POST(request: NextRequest) {
  try {const { email, type } = await request.json()
    
    if (!email) {
      const mappedError = mapApiError({ message: '이메일이 필요합니다.' })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    const { error } = await supabaseServer.auth.resend({
      type: type || 'signup',
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.AUTH.VERIFY}`
      }
    })
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    return NextResponse.json(
      createSuccessResponse({ 
        message: '인증 메일이 재발송되었습니다.' 
      })
    )
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}