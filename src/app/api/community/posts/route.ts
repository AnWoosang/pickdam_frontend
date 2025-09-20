import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import {
  createPaginatedResponse,
  createSuccessResponse,
  createErrorResponse,
  mapApiError
} from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function GET(request: NextRequest) {
  try {
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
    let query = supabaseServer
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
    
    return NextResponse.json(createPaginatedResponse(
      posts || [],
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
    const { title, content, categoryId, authorId } = await request.json()

    // 게시글 생성 (author 정보도 함께 조회)
    const { data: postResult, error: postError } = await supabaseServer
      .from('post')
      .insert({
        title,
        content,
        category: categoryId,
        author_id: authorId
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

    return NextResponse.json(createSuccessResponse({ post: postResult }), { status: 201 })

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}