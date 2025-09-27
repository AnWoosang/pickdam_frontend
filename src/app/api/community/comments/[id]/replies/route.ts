import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { createSuccessResponse, createPaginatedResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { CommentResponseDto, CommentWriteRequestDto } from '@/domains/community/types/dto/communityDto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id: parentCommentId } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 현재 사용자 ID를 토큰에서 가져오기
    const { data: { user } } = await supabase.auth.getUser()

    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('get_comment_replies_with_like_status', {
        p_current_user_id: user?.id || null,
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

    const processedReplies: CommentResponseDto[] = replies.map((reply: unknown) => {
      const record = reply as Record<string, unknown>;
      return {
        id: record.id,
        postId: record.post_id,
        parentCommentId: record.parent_comment_id,
        content: record.content,
        authorId: record.author_id,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        likeCount: record.like_count,
        author: {
          nickname: record.author_nickname,
          profileImageUrl: record.author_profile_image_url
        },
        isLiked: record.is_liked,
        replyCount: 0
      } as CommentResponseDto;
    })

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id: parentCommentId } = await params
    const requestData: CommentWriteRequestDto = await request.json()

    // 답글 생성을 위한 RPC 함수 호출 (부모 댓글의 reply_count도 업데이트, auth.uid() 사용)
    const { data: result, error: rpcError } = await supabase
      .rpc('create_reply_and_update_count', {
        p_content: requestData.content,
        p_post_id: requestData.postId,
        p_parent_comment_id: parentCommentId
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
      isLiked: false,  // 새로 생성된 답글은 좋아요 상태가 false
      replyCount: 0    // 답글의 답글은 지원하지 않으므로 0
    }

    return NextResponse.json(createSuccessResponse({ comment: commentResponse }), { status: StatusCodes.CREATED })

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}