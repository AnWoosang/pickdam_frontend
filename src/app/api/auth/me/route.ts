import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/infrastructure/api/supabaseServerAuth'
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    
    // 쿠키에서 세션 정보 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      const mappedError = mapApiError(authError || { message: 'Authentication required' })
      const errorResponse = createErrorResponse(mappedError)
      
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // 사용자 상세 정보 조회 (인증된 사용자 본인의 정보이므로 member 테이블 직접 조회)
    const { data: userData, error: userError } = await supabase
      .from('member')
      .select('*')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single()
    
    if (userError || !userData) {
      const mappedError = mapApiError(userError || { message: 'User not found' })
      const errorResponse = createErrorResponse(mappedError)
      
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    return NextResponse.json(
      createSuccessResponse({
        user: {
          id: userData.id,
          email: userData.email,
          nickname: userData.nickname,
          name: userData.name,
          profileImageUrl: userData.profile_image_url,
          isEmailVerified: userData.is_email_verified,
          birthDate: userData.birth_date,
          gender: userData.gender,
          createdAt: userData.created_at
        }
      })
    )
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}