import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { PostResponseDto } from '@/domains/community/types/dto/communityDto'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    const limit = parseInt(searchParams.get('limit') || '10')

    const { data, error } = await supabase
      .rpc('get_popular_posts', {
        days_param: days,
        limit_param: limit
      })
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // PostResponseDto 형태로 변환
    const postDtos: PostResponseDto[] = (data || []).map((item: Record<string, unknown>) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      authorId: item.author_id,
      category: item.category,
      viewCount: item.view_count,
      likeCount: item.like_count,
      commentCount: item.comment_count,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      isLiked: item.is_liked || false,
      author: {
        nickname: item.author_nickname || item.nickname,
        profileImageUrl: item.author_profile_image_url || item.profile_image_url
      }
    }))

    return NextResponse.json(createSuccessResponse(postDtos))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}