import { NextResponse } from 'next/server'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { UserSessionResponseDto, SessionResponseDto } from '@/domains/auth/types/dto/authDto'
import { UserResponseDto } from '@/domains/user/types/dto/userDto'

export async function POST() {
  try {
    const supabase = await createSupabaseClientWithCookie()

    // 현재 세션 갱신 시도
    const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()

    if (refreshError || !session?.user) {
      const mappedError = mapApiError(refreshError || { message: 'Failed to refresh session' })
      const errorResponse = createErrorResponse(mappedError)

      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // auth 메타데이터에서 사용자 정보 추출
    const userMetadata = session.user.user_metadata || {}

    const userResponseDto: UserResponseDto = {
      id: session.user.id,
      email: session.user.email!,
      nickname: userMetadata.nickname,
      name: userMetadata.name,
      profileImageUrl: userMetadata.profile_image_url,
      role: userMetadata.role
    }

    const sessionResponseDto: SessionResponseDto = {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: session.expires_in!,
      expiresAt: session.expires_at!,
      tokenType: session.token_type!
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