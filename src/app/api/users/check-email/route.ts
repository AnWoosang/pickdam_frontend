import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { validateEmail } from '@/shared/validation/common'
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function POST(request: NextRequest) {
  try {const { email } = await request.json()

    if (!email) {
      const mappedError = mapApiError({ message: '이메일을 입력해주세요.', status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }

    // 이메일 validation (공통 validation 사용)
    const validationError = validateEmail(email)
    if (validationError) {
      const mappedError = mapApiError({ message: validationError, status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }

    const trimmedEmail = email.trim().toLowerCase()

    const { data, error } = await supabaseServer
      .from('member')
      .select('id')
      .eq('email', trimmedEmail)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('이메일 중복확인 중 데이터베이스 오류:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }

    const isAvailable = !data
    return NextResponse.json(createSuccessResponse({
      isAvailable
    }))

  } catch (error) {
    console.error('이메일 중복확인 API 오류:', error)
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}