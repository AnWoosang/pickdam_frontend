import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
import { ToggleLikeResponseDto } from '@/domains/community/types/dto/communityDto'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { memberId } = await request.json()
    
    if (!memberId) {
      const mappedError = mapApiError({ message: 'memberId is required', status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // 새로운 RPC 함수 사용하여 좋아요 토글
    const { data, error } = await supabaseServer.rpc('toggle_post_like', {
      p_post_id: id,
      p_member_id: memberId
    })
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    if (!data.success) {
      const mappedError = mapApiError({ message: data.message || 'Failed to toggle like', status: StatusCodes.BAD_REQUEST })
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
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    
    if (!memberId) {
      const mappedError = mapApiError({ message: 'memberId is required', status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    const { data, error } = await supabaseServer
      .from('post_like')
      .select('id')
      .eq('post_id', id)
      .eq('member_id', memberId)
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