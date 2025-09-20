import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
import { createSupabaseServerClient } from '@/infrastructure/api/supabaseServerAuth'
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

    // 1. Member 테이블 업데이트
    const { data, error } = await supabaseServer
      .from('member')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // 2. Auth 메타데이터 업데이트
    const supabaseAuth = await createSupabaseServerClient()

    const userMetadataUpdates: Record<string, any> = {}

    if (updates.nickname !== undefined) {
      userMetadataUpdates.nickname = updates.nickname
    }

    if (updates.profileImageUrl !== undefined) {
      userMetadataUpdates.profile_image_url = updates.profileImageUrl
    }

    if (Object.keys(userMetadataUpdates).length > 0) {
      const { error: authUpdateError } = await supabaseAuth.auth.admin.updateUserById(id, {
        user_metadata: userMetadataUpdates
      })

      if (authUpdateError) {
        const mappedError = mapApiError(authUpdateError)
        const errorResponse = createErrorResponse(mappedError)
        return NextResponse.json(errorResponse, { status: mappedError.statusCode })
      }
    }

    const userResponse: UserResponseDto = data
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
    const { data, error: rpcError } = await supabaseAdmin.rpc('process_user_withdrawal', {
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