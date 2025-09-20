import { NextRequest, NextResponse } from 'next/server'
import { createPaginatedResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
import { CommentResponseDto } from '@/domains/community/types/dto/communityDto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: parentCommentId } = await params
    const { searchParams } = new URL(request.url)
    const currentUserId = searchParams.get('currentUserId')  // 현재 사용자 ID (선택적)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const { data: rpcResult, error: rpcError } = await supabaseServer
      .rpc('get_comment_replies_with_like_status', {
        p_current_user_id: currentUserId,
        p_limit: limit,
        p_page: page,
        p_parent_comment_id: parentCommentId
      })

    if (rpcError) {
      const mappedError = mapApiError(rpcError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    const replies = rpcResult || []
    const total_count = replies.length > 0 ? replies[0].total_count : 0

    const processedReplies: CommentResponseDto[] = replies.map((reply: any): CommentResponseDto => ({
      id: reply.id,
      postId: reply.post_id,
      parentCommentId: reply.parent_comment_id,
      content: reply.content,
      authorId: reply.author_id,
      createdAt: reply.created_at,
      updatedAt: reply.updated_at,
      likeCount: reply.like_count,
      author: {
        nickname: reply.author_nickname,
        profileImageUrl: reply.author_profile_image_url
      },
      isLiked: reply.is_liked,
      replyCount: 0
    }))

    const totalPages = Math.ceil(total_count / limit)

    return NextResponse.json(createPaginatedResponse(processedReplies, {
      total: total_count,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }))

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}