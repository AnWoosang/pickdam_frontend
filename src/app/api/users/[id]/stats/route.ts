import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { MypageStatsResponseDto } from '@/domains/user/types/dto/mypageDto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params

    const { data, error } = await supabase
      .from('user_stats_view')
      .select('*')
      .eq('user_id', id)
      .single()
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // MypageStatsResponseDto 형태로 변환
    const statsDto: MypageStatsResponseDto = {
      userId: data.user_id,
      totalPosts: data.total_posts,
      totalComments: data.total_comments,
      totalReviews: data.total_reviews,
      createdAt: data.created_at
    }

    return NextResponse.json(createSuccessResponse({ stats: statsDto }))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}