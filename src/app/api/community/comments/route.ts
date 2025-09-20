import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { createSuccessResponse, createPaginatedResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
import { CommentResponseDto, CommentWriteRequestDto } from '@/domains/community/types/dto/communityDto'

export async function GET(request: NextRequest) {
  
  try {

    const { searchParams } = new URL(request.url)

    const postId = searchParams.get('postId')!  // 타입 단언: 항상 존재함을 보장
    const currentUserId = searchParams.get('currentUserId')  // 현재 사용자 ID (선택적)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // RPC 함수로 댓글 목록 조회 (좋아요 상태 포함, 한 번의 쿼리로 처리)
    const { data: rpcResult, error: commentsError } = await supabaseServer
      .rpc('get_comments_with_like_status', {
        p_post_id: postId,
        p_current_user_id: currentUserId,
        p_page: page,
        p_limit: limit
      })

    const comments = rpcResult || []
    const count = comments.length > 0 ? comments[0].total_count : 0
    
    if (commentsError) {
      const mappedError = mapApiError(commentsError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // 응답 데이터 변환 (RPC에서 이미 모든 필드가 처리됨)
    const processedComments: CommentResponseDto[] = comments.map((comment: any): CommentResponseDto => ({
      id: comment.id,
      postId: comment.post_id,
      parentCommentId: comment.parent_comment_id,
      content: comment.content,
      authorId: comment.author_id,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      likeCount: comment.like_count,
      author: {
        nickname: comment.author_nickname,
        profileImageUrl: comment.author_profile_image_url
      },
      isLiked: comment.is_liked,
      replyCount: comment.reply_count
    }))
    
    const totalPages = Math.ceil((count || 0) / limit)
    return NextResponse.json(createPaginatedResponse(processedComments, {
      total: count || 0,
      page: page,
      limit: limit,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData: CommentWriteRequestDto = await request.json()
    const { content, postId, authorId } = requestData

    // RPC 함수로 댓글 생성 및 게시글 comment_count 업데이트
    const { data: result, error: rpcError } = await supabaseServer
      .rpc('create_comment_and_update_count', {
        p_content: content,
        p_post_id: postId,
        p_author_id: authorId
      })

    if (rpcError) {
      const mappedError = mapApiError(rpcError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    const commentResponse: CommentResponseDto = {
      id: result.id,
      postId: result.post_id,
      parentCommentId: result.parent_comment_id,
      content: result.content,
      authorId: result.author_id,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      likeCount: result.like_count,
      author: {
        nickname: result.author_nickname,
        profileImageUrl: result.author_profile_image_url
      },
      isLiked: false,  // 새로 생성된 댓글은 좋아요 상태가 false
      replyCount: result.reply_count
    }

    return NextResponse.json(createSuccessResponse({ comment: commentResponse }), { status: StatusCodes.CREATED })

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}