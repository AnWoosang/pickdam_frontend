import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { ROUTES } from '@/app/router/routes'
import { supabaseAdmin } from "@/infrastructure/api/supabaseAdmin";
import { ResendEmailRequestDto } from '@/domains/auth/types/dto/authDto'

export async function POST(request: NextRequest) {
  try {
    const requestData: ResendEmailRequestDto = await request.json()

    const { error } = await supabaseAdmin.auth.resend({
      type: requestData.type || 'signup',
      email: requestData.email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.AUTH.VERIFY}`
      }
    })
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    return NextResponse.json(
      createSuccessResponse({ 
        message: '인증 메일이 재발송되었습니다.' 
      })
    )
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}