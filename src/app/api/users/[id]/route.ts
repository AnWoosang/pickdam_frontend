import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { supabaseAdmin } from '@/infrastructure/api/supabaseAdmin'
import { UpdateProfileRequestDto, WithdrawMemberRequestDto, UserResponseDto } from '@/domains/user/types/dto/userDto'
import {
  createSuccessResponse,
  createErrorResponse,
  mapApiError,
} from '@/infrastructure/api/supabaseResponseUtils'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates: UpdateProfileRequestDto = await request.json()

    const supabase = await createSupabaseClientWithCookie()

    // 🔒 본인 확인: 토큰으로 현재 사용자 검증
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || user.id !== id) {
      const errorResponse = createErrorResponse({
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
        message: '본인의 프로필만 수정할 수 있습니다.',
        details: 'User ID mismatch or invalid token'
      })
      return NextResponse.json(errorResponse, { status: 401 })
    }

    // 1. Member 테이블 업데이트 (필드명 매핑)
    const memberUpdates: Record<string, unknown> = {}

    if (updates.nickname !== undefined) {
      memberUpdates.nickname = updates.nickname
    }

    if (updates.profileImageUrl !== undefined) {
      memberUpdates.profile_image_url = updates.profileImageUrl
    }

    const { data, error } = await supabase
      .from('member')
      .update(memberUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // 2. Auth 메타데이터 업데이트 (Service Role 권한 필요)
    const userMetadataUpdates: Record<string, unknown> = {}

    if (updates.nickname !== undefined) {
      userMetadataUpdates.nickname = updates.nickname
    }

    if (updates.profileImageUrl !== undefined) {
      userMetadataUpdates.profile_image_url = updates.profileImageUrl
    }

    if (Object.keys(userMetadataUpdates).length > 0) {
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(id, {
        user_metadata: userMetadataUpdates
      })

      if (authUpdateError) {
        const mappedError = mapApiError(authUpdateError)
        const errorResponse = createErrorResponse(mappedError)
        return NextResponse.json(errorResponse, { status: mappedError.statusCode })
      }
    }

    // UserResponseDto 형태로 변환
    const userResponse: UserResponseDto = {
      id: data.id,
      email: data.email,
      name: data.name,
      nickname: data.nickname,
      profileImageUrl: data.profile_image_url,
      role: data.role
    }

    return NextResponse.json(createSuccessResponse({ user: userResponse }))

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { reason }: WithdrawMemberRequestDto = await request.json()

    const supabase = await createSupabaseClientWithCookie()

    // 🔒 본인 확인: 토큰으로 현재 사용자 검증
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || user.id !== id) {
      const errorResponse = createErrorResponse({
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
        message: '본인만 탈퇴할 수 있습니다.',
        details: 'User ID mismatch or invalid token'
      })
      return NextResponse.json(errorResponse, { status: 401 })
    }

    // 1. Auth 메타데이터 업데이트
    const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(id, {
      app_metadata: { deleted_at: new Date().toISOString() }
    })

    if (authUpdateError) {
      const mappedError = mapApiError(authUpdateError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // 2. 모든 데이터 정리 (Service Role 권한으로)
    const { error: rpcError } = await supabaseAdmin.rpc('process_user_withdrawal', {
      p_user_id: id,
      p_reason: reason || null
    })

    if (rpcError) {
      const mappedError = mapApiError(rpcError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    return new NextResponse(null, { status: 204 })

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}