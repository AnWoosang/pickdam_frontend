import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { validateNickname } from '@/shared/validation/common'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
import {
  createSuccessResponse,
  createErrorResponse,
  mapApiError,
} from '@/infrastructure/api/supabaseResponseUtils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nickname = searchParams.get('nickname')
    
    if (!nickname) {
      const mappedError = mapApiError({ message: 'nickname이 필요합니다', status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // 닉네임 validation (공통 validation 사용)
    const validationError = validateNickname(nickname)
    if (validationError) {
      const mappedError = mapApiError({ message: validationError, status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    const trimmedNickname = nickname.trim()
    
    const { data, error } = await supabaseServer
      .from('member')
      .select('id')
      .eq('nickname', trimmedNickname)
      .limit(1)
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    return NextResponse.json(createSuccessResponse({ isDuplicate: data && data.length > 0 }))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}