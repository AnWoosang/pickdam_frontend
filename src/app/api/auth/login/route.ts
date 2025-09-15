import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/infrastructure/api/supabaseServerAuth'
import {
  createSuccessResponse,
  createErrorResponse,
  mapApiError,
  getStatusFromErrorCode
} from '@/infrastructure/api/supabaseResponseUtils'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const supabase = await createSupabaseServerClient()
    
    // Supabase Auth로 로그인 시도
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (authError) {
      const mappedError = mapApiError(authError)
      const errorResponse = createErrorResponse(mappedError)
      
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // 🔥 Auth 테이블에서 삭제된 사용자 체크
    if (authData.user.deleted_at != null) {
      const mappedError = mapApiError({ 
        message: 'User account has been deleted' 
      })
      const errorResponse = createErrorResponse(mappedError)
      
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('member')
      .select('*')
      .eq('id', authData.user.id)
      .is('deleted_at', null)
      .single()
    
    if (userError || !userData) {
      const mappedError = mapApiError(userError)
      const errorResponse = createErrorResponse(mappedError)
      
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    return NextResponse.json(
      createSuccessResponse({
        user: userData,
        session: authData.session
      })
    )
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}