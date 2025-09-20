import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/infrastructure/api/supabaseServerAuth'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { UserResponseDto } from '@/domains/user/types/dto/userDto'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    
    // 쿠키에서 세션 정보 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      const mappedError = mapApiError(authError || { message: 'Authentication required' })
      const errorResponse = createErrorResponse(mappedError)
      
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // auth 메타데이터에서 사용자 정보 추출
    const userMetadata = user.user_metadata || {}

    const userResponseDto: UserResponseDto = {
      id: user.id,
      email: user.email!,
      nickname: userMetadata.nickname,
      name: userMetadata.name,
      profileImageUrl: userMetadata.profile_image_url,
      role: userMetadata.role
    }

    return NextResponse.json(
      createSuccessResponse({
        user: userResponseDto
      })
    )
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}