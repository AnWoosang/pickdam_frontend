import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseAdmin } from "@/infrastructure/api/supabaseAdmin";
import { VerifyEmailRequestDto } from '@/domains/auth/types/dto/authDto'

export async function POST(request: NextRequest) {
  try {
    const requestData: VerifyEmailRequestDto = await request.json()

    const tokenToUse = requestData.tokenHash || requestData.token;

    if (!tokenToUse) {
      const mappedError = mapApiError({ message: 'Token is required' })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Supabase에서 이메일 인증 처리
    const {error } = await supabaseAdmin.auth.verifyOtp({
      token_hash: tokenToUse,
      type: requestData.type ?? 'email'
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