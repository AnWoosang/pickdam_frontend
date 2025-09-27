import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { PostIncrementViewResponseDto } from '@/domains/community/types/dto/communityDto'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params

    // 간소화된 RPC 함수 사용하여 조회수 증가 (상품과 동일한 방식)
    const { data, error } = await supabase.rpc('increment_post_view_simple', {
      p_post_id: id
    })
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    const responseDto: PostIncrementViewResponseDto = {
      postId: id,
      viewCount: data.view_count
    }

    return NextResponse.json(createSuccessResponse(responseDto))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}