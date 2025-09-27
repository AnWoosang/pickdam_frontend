import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import {
  createSuccessResponse,
  createErrorResponse,
  mapApiError,
} from '@/infrastructure/api/supabaseResponseUtils'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    const supabase = await createSupabaseClientWithCookie()

    // 비밀번호 업데이트
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError) {
      const mappedError = mapApiError(updateError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    return NextResponse.json(createSuccessResponse({}))

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}