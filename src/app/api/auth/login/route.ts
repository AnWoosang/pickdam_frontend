import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/infrastructure/api/supabaseServerAuth'
import {
  createSuccessResponse,
  createErrorResponse,
  mapApiError,
} from '@/infrastructure/api/supabaseResponseUtils'
import { UserSessionResponseDto, SessionResponseDto } from '@/domains/auth/types/dto/authDto'
import { UserResponseDto } from '@/domains/user/types/dto/userDto'

interface LoginRequestDto {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequestDto = await request.json()

    const supabase = await createSupabaseServerClient()
    
    // Supabase Auth로 로그인 시도
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (authError) {
      const mappedError = mapApiError(authError)
      const errorResponse = createErrorResponse(mappedError)
      
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // 🔥 Auth 테이블에서 삭제된 사용자 체크
    if (authData.user.deleted_at != null) {
      const mappedError = mapApiError({ 
        status: 400,
        message: 'User account has been deleted' 
      })
      const errorResponse = createErrorResponse(mappedError)
      
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // auth 메타데이터에서 사용자 정보 추출
    const userMetadata = authData.user.user_metadata || {}

    const userResponseDto: UserResponseDto = {
      id: authData.user.id,
      email: authData.user.email!,
      nickname: userMetadata.nickname,
      name: userMetadata.name,
      profileImageUrl: userMetadata.profile_image_url,
      role: userMetadata.role
    }

    const sessionResponseDto: SessionResponseDto = {
      accessToken: authData.session!.access_token,
      refreshToken: authData.session!.refresh_token,
      expiresIn: authData.session!.expires_in!,
      expiresAt: authData.session!.expires_at!,
      tokenType: authData.session!.token_type!
    }

    const userSessionResponseDto: UserSessionResponseDto = {
      user: userResponseDto,
      session: sessionResponseDto
    }

    return NextResponse.json(createSuccessResponse(userSessionResponseDto))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}