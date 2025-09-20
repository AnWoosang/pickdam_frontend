import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

interface VerifyEmailRequestDto {
  tokenHash?: string;
  token?: string;
  type?: 'email' | 'recovery';
}

export async function POST(request: NextRequest) {
  try {
    const data: VerifyEmailRequestDto = await request.json()

    const tokenToUse = data.tokenHash || data.token;

    if (!tokenToUse) {
      const mappedError = mapApiError({ message: 'Token is required' })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Supabase에서 이메일 인증 처리
    const { data: authData, error } = await supabaseServer.auth.verifyOtp({
      token_hash: tokenToUse,
      type: data.type ?? 'email'
    })

    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    const successResponse = createSuccessResponse({
      message: '이메일 인증이 완료되었습니다!'
    });

    return NextResponse.json(successResponse)

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}