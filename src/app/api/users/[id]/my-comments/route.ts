import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { createPaginatedResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils';
import { MyCommentResponseDto } from '@/domains/user/types/dto/mypageDto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id: userId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;
    // 총 개수 조회
    const { count, error: countError } = await supabase
      .from('comment')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .is('deleted_at', null);

    if (countError) {
      throw countError;
    }

    // 댓글 목록 조회 (게시글 정보 포함)
    const { data: comments, error: commentsError } = await supabase
      .from('comment')
      .select(`
        id,
        content,
        created_at,
        updated_at,
        like_count,
        parent_comment_id,
        post_id,
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
    const transformedComments: MyCommentResponseDto[] = comments?.map(comment => {
      const author = Array.isArray(comment.author) ? comment.author[0] : comment.author as Record<string, unknown>;
      const post = Array.isArray(comment.post) ? comment.post[0] : comment.post as Record<string, unknown>;

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
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}