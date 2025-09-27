import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import {
  createSuccessResponse,
  createErrorResponse,
  mapApiError,
} from '@/infrastructure/api/supabaseResponseUtils'
import { FindPasswordRequestDto } from '@/domains/auth/types/dto/authDto'

export async function POST(request: NextRequest) {
  try {
    const { email }: FindPasswordRequestDto = await request.json()

    const trimmedEmail = email.toLowerCase().trim()

    const supabase = await createSupabaseClientWithCookie()

    // 이메일이 우리 시스템에 등록되어 있는지 확인
    const { data: existingUser, error: checkError } = await supabase
      .from('member')
      .select('id, email')
      .eq('email', trimmedEmail)
      .single()

    if (checkError || !existingUser) {
      // 보안상 실제 이메일 존재 여부를 노출하지 않고 성공 응답
      const successResponse = createSuccessResponse(
        { message: '비밀번호 재설정 이메일을 발송했습니다.' }
      )
      return NextResponse.json(successResponse)
    }

    // Supabase Auth를 통한 비밀번호 재설정 이메일 발송
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    })

    if (resetError) {
      const mappedError = mapApiError(resetError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    const successResponse = createSuccessResponse(
      { message: '비밀번호 재설정 이메일을 발송했습니다.' }
    )
    return NextResponse.json(successResponse)

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}