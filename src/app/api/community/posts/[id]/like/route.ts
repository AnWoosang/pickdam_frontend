import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { ToggleLikeResponseDto } from '@/domains/community/types/dto/communityDto'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params

    // RPC 함수가 auth.uid()를 사용하여 사용자 확인
    const { data, error } = await supabase.rpc('toggle_post_like', {
      p_post_id: id
    })
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    const responseDto: ToggleLikeResponseDto = {
      isLiked: data.liked,
      newLikeCount: data.like_count
    }

    return NextResponse.json(createSuccessResponse(responseDto))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params

    // RLS가 현재 사용자의 좋아요 상태만 반환
    const { data, error } = await supabase
      .from('post_like')
      .select('id')
      .eq('post_id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116은 "no rows returned" 오류
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    const liked = !!data
    
    return NextResponse.json(createSuccessResponse({ 
      data: { liked } 
    }))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}