import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
import { CommentResponseDto, CommentWriteRequestDto } from '@/domains/community/types/dto/communityDto'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { content, authorId, currentUserId } = await request.json()
    const { id: commentId } = await params

    // RPC 함수로 댓글 업데이트 및 상세 정보 조회
    const { data: result, error: rpcError } = await supabaseServer
      .rpc('update_comment_with_details', {
        comment_id: commentId,
        new_content: content,
        author_id: authorId,
        current_user_id: currentUserId
      })

    if (rpcError) {
      const mappedError = mapApiError(rpcError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    const commentResponse: CommentResponseDto = {
      id: result.data.id,
      postId: result.data.post_id,
      parentCommentId: result.data.parent_comment_id,
      content: result.data.content,
      authorId: result.data.author_id,
      createdAt: result.data.created_at,
      updatedAt: result.data.updated_at,
      likeCount: result.data.like_count,
      author: {
        nickname: result.data.author_nickname,
        profileImageUrl: result.data.author_profile_image_url
      },
      isLiked: result.data.is_liked,
      replyCount: result.data.reply_count
    }

    return NextResponse.json(createSuccessResponse({ comment: commentResponse }))
    
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
    const { id: commentId } = await params

    //  API: delete_comment_with_replies RPC 함수 사용
    // - 처리 내용:
    // - 부모댓글이면 모든 답글도 soft delete
    // - 답글이면 부모의 reply_count 감소
    // - 게시글의 comment_count 업데이트
    // - 하지만 댓글 좋아요(comment_like)는 처리 안
    const { data: result, error: rpcError } = await supabaseServer
      .rpc('delete_comment_with_replies', {
        p_comment_id: commentId
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: parentCommentId } = await params
    const requestData: CommentWriteRequestDto = await request.json()
    const {
      content,
      postId,
      authorId
    } = requestData

    // 답글 생성을 위한 RPC 함수 호출 (부모 댓글의 reply_count도 업데이트)
    const { data: result, error: rpcError } = await supabaseServer
      .rpc('create_reply_and_update_count', {
        p_content: content,
        p_post_id: postId,
        p_author_id: authorId,
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