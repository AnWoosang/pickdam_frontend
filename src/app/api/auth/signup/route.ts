import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import {
  createSuccessResponse,
  createErrorResponse,
  mapApiError,
  getStatusFromErrorCode
} from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
import { ROUTES } from '@/app/router/routes'

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      password, 
      name, 
      nickname, 
      birthDate, 
      gender,
      provider,
      role
    } = await request.json()
    
    // 비즈니스 로직에서 이미 검증된 데이터만 받음
    
    // Supabase Auth로 회원가입
    const { data: authData, error: authError } = await supabaseServer.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.AUTH.VERIFY}`,
        data: {
          name,
          nickname,
          birth_date: birthDate,
          gender
        }
      }
    })
    
    if (authError) {
      const mappedError = mapApiError(authError)
      const errorResponse = createErrorResponse(mappedError)
      
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // authError가 없으면 user는 항상 존재함이 보장됨
    const user = authData.user!
    
    // member 테이블에 사용자 정보 저장
    const { error: memberError } = await supabaseServer
      .from('member')
      .insert({
        id: user.id,
        email,
        name,
        nickname,
        birth_date: birthDate,
        gender,
        provider,
        role,
        is_email_verified: false
      })
    
    if (memberError) {
      await supabaseServer.auth.admin.deleteUser(user.id)
      const mappedError = mapApiError({ message: '회원가입에 실패했습니다.' })
      const errorResponse = createErrorResponse(mappedError)
      
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    return NextResponse.json(
      createSuccessResponse({}),
      { status: StatusCodes.CREATED }
    )
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}