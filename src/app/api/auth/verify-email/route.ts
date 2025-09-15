import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function POST(request: NextRequest) {
  try {const data = await request.json()
    
    // 필수 파라미터 검증
    if (!data.token_hash && !data.token) {
      const mappedError = mapApiError({ message: '인증 토큰이 필요합니다.' })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }

    // Supabase에서 이메일 인증 처리
    const { error } = await supabaseServer.auth.verifyOtp({
      token_hash: data.token_hash || data.token,
      type: data.type || 'signup'
    })

    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }

    return NextResponse.json(
      createSuccessResponse({ 
        message: '이메일 인증이 완료되었습니다!' 
      })
    )

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}