import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { StatusCodes } from 'http-status-codes'
import { ToggleCommentLikeResponseDto } from '@/domains/community/types/dto/communityDto'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {const { memberId } = await request.json()
    const { id: commentId } = await params
        
    // Use RPC function for like toggle
    const { data: result, error } = await supabaseServer
      .rpc('toggle_comment_like', {
        p_comment_id: commentId,
        p_member_id: memberId
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