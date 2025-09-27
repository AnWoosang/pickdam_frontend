import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { StatusCodes } from 'http-status-codes'
import { ToggleCommentLikeResponseDto } from '@/domains/community/types/dto/communityDto'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id: commentId } = await params

    // RPC 함수가 auth.uid()를 사용하여 사용자 확인
    const { data: result, error } = await supabase
      .rpc('toggle_comment_like', {
        p_comment_id: commentId
      })
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    const responseData: ToggleCommentLikeResponseDto = {
      commentId: commentId,
      isLiked: result.liked,
      likeCount: result.like_count
    }

    return NextResponse.json(createSuccessResponse(responseData), { status: StatusCodes.CREATED })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}