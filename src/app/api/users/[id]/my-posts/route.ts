import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { createPaginatedResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils';
import { MyPostResponseDto } from '@/domains/user/types/dto/mypageDto';

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
      .from('post')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .is('deleted_at', null);

    if (countError) {
      throw countError;
    }

    // 게시글 목록 조회
    const { data: posts, error: postsError } = await supabase
      .from('post')
      .select(`
        id,
        title,
        content,
        category,
        view_count,
        like_count,
        comment_count,
        created_at,
        updated_at,
        author:author_id (
          id,
          nickname,
          profile_image_url
        )
      `)
      .eq('author_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (postsError) {
      throw postsError;
    }

    // 데이터 변환 (MyPost DTO 형식으로)
    const transformedPosts: MyPostResponseDto[] = posts?.map(post => {
      const author = Array.isArray(post.author) ? post.author[0] : post.author as Record<string, unknown>;

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: author?.id || '',
        authorNickname: author?.nickname || '알 수 없음',
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        likeCount: post.like_count || 0,
        commentCount: post.comment_count || 0,
        isLiked: false, // 내 게시글이므로 좋아요 여부 상관없음
        categoryId: post.category,
        categoryName: post.category,
        profileImageUrl: author?.profile_image_url
      };
    }) || [];

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json(createPaginatedResponse(transformedPosts, {
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