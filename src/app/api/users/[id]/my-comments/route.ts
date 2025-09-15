import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
;
import { createPaginatedResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {const { id: userId } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  try {
    // 총 개수 조회
    const { count, error: countError } = await supabaseServer
      .from('comment')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .is('deleted_at', null);

    if (countError) {
      throw countError;
    }

    // 댓글 목록 조회 (게시글 정보 포함)
    const { data: comments, error: commentsError } = await supabaseServer
      .from('comment')
      .select(`
        id,
        content,
        created_at,
        updated_at,
        like_count,
        parent_comment_id,
        post_id,
        is_deleted,
        author:author_id (
          nickname,
          profile_image_url
        ),
        post:post_id (
          id,
          title
        )
      `)
      .eq('author_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (commentsError) {
      throw commentsError;
    }

    // 데이터 변환
    const transformedComments = comments?.map(comment => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const author = Array.isArray(comment.author) ? comment.author[0] : comment.author as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const post = Array.isArray(comment.post) ? comment.post[0] : comment.post as any;
      
      return {
        id: comment.id,
        postId: comment.post_id,
        postTitle: post?.title || '제목 없음',
        content: comment.content,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        likeCount: comment.like_count || 0,
        parentCommentId: comment.parent_comment_id,
        author: author?.nickname || '알 수 없음',
        isDeleted: comment.is_deleted || false,
        isLiked: false, // 내 댓글이므로 좋아요 여부 상관없음
        profileImageUrl: author?.profile_image_url
      };
    }) || [];

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json(createPaginatedResponse(transformedComments, {
      total: count || 0,
      page: page,
      limit: limit,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }));

  } catch (error) {
    console.error('내 댓글 조회 실패:', error);
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}