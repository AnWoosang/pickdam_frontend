import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
// StatusCodes 제거 - getStatusFromErrorCode 사용
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {const { memberId } = await request.json()
    const { id: commentId } = await params
    
    if (!commentId || !memberId) {
      const mappedError = mapApiError({ message: 'Missing required fields' })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // Use RPC function for like toggle
    const { data: result, error } = await supabaseServer
      .rpc('toggle_comment_like', {
        p_comment_id: commentId,
        p_member_id: memberId
      })
    
    if (error) {
      console.error('Toggle comment like RPC error:', error)
      
      if (error.message === 'COMMENT_NOT_FOUND') {
        const mappedError = mapApiError({ message: 'Comment not found' })
        const errorResponse = createErrorResponse(mappedError)
        return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
      } else if (error.message === 'MEMBER_NOT_FOUND') {
        const mappedError = mapApiError({ message: 'User not found' })
        const errorResponse = createErrorResponse(mappedError)
        return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
      }
      
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    return NextResponse.json(createSuccessResponse({
      success: result.success,
      isLiked: result.liked,
      newLikeCount: result.like_count
    }), { status: 201 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}