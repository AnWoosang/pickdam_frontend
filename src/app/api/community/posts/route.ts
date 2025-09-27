import { NextRequest, NextResponse } from 'next/server'
import {
  createPaginatedResponse,
  createSuccessResponse,
  createErrorResponse,
  mapApiError
} from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { PostResponseDto, WritePostRequestDto } from '@/domains/community/types/dto/communityDto';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const searchType = searchParams.get('searchType') // 검색 타입 파라미터 추가
    const sortByParam = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // 허용되는 정렬 컬럼 검증
    const validSortColumns = ['created_at', 'view_count', 'like_count'];
    const sortBy = validSortColumns.includes(sortByParam) ? sortByParam : 'created_at'

    // member 뷰를 사용하여 posts 조회
    let query = supabase
      .from('post')
      .select(`
        *,
        author:member!author_id (
          nickname,
          profile_image_url
        )
      `, { count: 'exact' })
      .is('deleted_at', null)
    
    // 카테고리 필터
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    // 검색 필터 (검색 타입에 따른 분기)
    if (search) {
      switch (searchType) {
        case 'title':
          query = query.ilike('title', `%${search}%`)
          break
        case 'content':
          query = query.ilike('content', `%${search}%`)
          break
        case 'author':
          // author 검색은 member의 nickname으로 검색
          query = query.eq('author.nickname', search)
          break
        case 'titleContent':
        default:
          // 기본값은 제목+내용 검색
          query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
          break
      }
    }
    
    // 정렬
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    
    // 페이지네이션
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    const { data: posts, error, count } = await query

    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // DB 데이터를 PostResponseDto 형태로 변환
    const formattedPosts: PostResponseDto[] = (posts || []).map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.author_id,
      category: post.category,
      viewCount: post.view_count,
      likeCount: post.like_count,
      commentCount: post.comment_count,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      isLiked: post.is_liked || false,
      author: {
        nickname: post.author.nickname,
        profileImageUrl: post.author.profile_image_url
      }
    }));

    return NextResponse.json(createPaginatedResponse(
      formattedPosts,
      {
        total: count || 0,
        page: page,
        limit: limit,
        totalPages: Math.ceil((count || 0) / limit),
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPreviousPage: page > 1
      }
    ))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const requestData: WritePostRequestDto = await request.json()

    // 게시글 생성 (author 정보도 함께 조회)
    const { data: postResult, error: postError } = await supabase
      .from('post')
      .insert({
        title: requestData.title,
        content: requestData.content,
        category: requestData.categoryId,
        author_id: requestData.authorId
      })
      .select(`
        *,
        author:member!author_id (
          nickname,
          profile_image_url
        )
      `)
      .single()

    if (postError) {
      const mappedError = mapApiError(postError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // DB 데이터를 PostResponseDto 형태로 변환
    const formattedPost: PostResponseDto = {
      id: postResult.id,
      title: postResult.title,
      content: postResult.content,
      authorId: postResult.author_id,
      category: postResult.category,
      viewCount: postResult.view_count || 0,
      likeCount: postResult.like_count || 0,
      commentCount: postResult.comment_count || 0,
      createdAt: postResult.created_at,
      updatedAt: postResult.updated_at,
      isLiked: false, // 새로 생성된 게시글은 좋아요하지 않은 상태
      author: {
        nickname: postResult.author.nickname,
        profileImageUrl: postResult.author.profile_image_url
      }
    };

    return NextResponse.json(createSuccessResponse({ post: formattedPost }), { status: 201 })

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}