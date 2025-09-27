import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import {
  createSuccessResponse,
  createErrorResponse,
  mapApiError
} from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseAdmin } from "@/infrastructure/api/supabaseAdmin";
import { ROUTES } from '@/app/router/routes'
import { SignupRequestDto } from '@/domains/auth/types/dto/authDto'

export async function POST(request: NextRequest) {
  try {
    const requestData: SignupRequestDto = await request.json()
    
    // Supabase Auth로 회원가입
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: requestData.email,
      password: requestData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.AUTH.VERIFY}`,
        data: {
          name: requestData.name,
          nickname: requestData.nickname,
          gender: requestData.gender,
          role: requestData.role,
          profile_image_url: null
        }
      }
    })
    
    if (authError) {
      const mappedError = mapApiError(authError)
      const errorResponse = createErrorResponse(mappedError)
      
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // authError가 없으면 user는 항상 존재함이 보장됨
    const user = authData.user!
    
    // member 테이블에 사용자 정보 저장
    const { error: memberError } = await supabaseAdmin
      .from('member')
      .insert({
        id: user.id,
        email: requestData.email,
        name: requestData.name,
        nickname: requestData.nickname,
        birth_date: requestData.birthDate,
        gender: requestData.gender
      })
    
    if (memberError) {
      await supabaseAdmin.auth.admin.deleteUser(user.id)
      const mappedError = mapApiError(memberError)
      const errorResponse = createErrorResponse(mappedError)

      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    return NextResponse.json(
      createSuccessResponse({}),
      { status: StatusCodes.CREATED }
    )
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}