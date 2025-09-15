import { NextRequest, NextResponse } from 'next/server'
import { createPaginatedResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {const { id: parentCommentId } = await params
    const { searchParams } = new URL(request.url)
    const currentUserId = searchParams.get('currentUserId')  // 현재 사용자 ID (선택적)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    console.log('🔍 [Replies API] Parameters:', { parentCommentId, currentUserId, page, limit })
    
    // 답글 조회 쿼리 (좋아요 상태 포함)
    let query = supabaseServer
      .from('comment')
      .select(`
        *,
        author:member!comment_author_id_fkey (
          nickname,
          profile_image_url
        )
      `, { count: 'exact' })
      .eq('parent_comment_id', parentCommentId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
      .range((page - 1) * limit, page * limit - 1)
    
    // 로그인한 사용자인 경우 좋아요 상태도 포함
    if (currentUserId) {
      query = supabaseServer
        .from('comment')
        .select(`
          *,
          author:member!comment_author_id_fkey (
            nickname,
            profile_image_url
          ),
          user_like:comment_like!left (id)
        `, { count: 'exact' })
        .eq('parent_comment_id', parentCommentId)
        .eq('user_like.member_id', currentUserId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
        .range((page - 1) * limit, page * limit - 1)
    }
    
    const { data: replies, error: repliesError, count } = await query
    
    console.log('🔍 [Replies API] Query result:', { 
      replies: replies?.length, 
      count, 
      error: repliesError 
    })
    
    if (repliesError) {
      console.error('❌ [Replies API] Fetch error:', repliesError)
      const mappedError = mapApiError(repliesError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // 응답 데이터 변환: 좋아요 상태 추가
    const processedReplies = (replies || []).map(reply => ({
      ...reply,
      isLiked: currentUserId ? (reply.user_like && reply.user_like.length > 0) : false,
      replyCount: 0, // 답글의 답글은 현재 지원하지 않음 (2단계 제한)
      user_like: undefined  // 클라이언트에 불필요한 데이터 제거
    }))
    
    console.log('🔍 [Replies API] Final result:', { 
      processedReplies: processedReplies.length, 
      count 
    })
    
    const totalPages = Math.ceil((count || 0) / limit)
    return NextResponse.json(createPaginatedResponse(processedReplies, {
      total: count || 0,
      page: page,
      limit: limit,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }))
    
  } catch (error) {
    console.error('❌ [Replies API] Unexpected error:', error)
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}