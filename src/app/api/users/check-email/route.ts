import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { validateEmail } from '@/shared/validation/common'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { email } = await request.json()

    if (!email) {
      const mappedError = mapApiError({ message: '이메일을 입력해주세요.', status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // 이메일 validation (공통 validation 사용)
    const validationError = validateEmail(email)
    if (validationError) {
      const mappedError = mapApiError({ message: validationError, status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    const trimmedEmail = email.trim().toLowerCase()

    const { data, error } = await supabase
      .from('member')
      .select('id')
      .eq('email', trimmedEmail)
      .single()

    if (error && error.code !== 'PGRST116') {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    const isAvailable = !data
    return NextResponse.json(createSuccessResponse({
      isAvailable
    }))

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}