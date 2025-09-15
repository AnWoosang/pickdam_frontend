import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { createSuccessResponse, createPaginatedResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function GET(request: NextRequest) {
    console.log('🚀 [Comments API] ROUTE HANDLER REACHED!', new Date().toISOString())
  console.log('🚀 [Comments API] Full URL:', request.url)
  
  try {
    console.log('🔍 [Comments API] Request received:', request.url)
    
    const { searchParams } = new URL(request.url)
    
    const postId = searchParams.get('postId')!  // 타입 단언: 항상 존재함을 보장
    const currentUserId = searchParams.get('currentUserId')  // 현재 사용자 ID (선택적)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    console.log('🔍 [Comments API] Parameters:', { postId, currentUserId, page, limit })
    
    // 통합 쿼리: 댓글 + 작성자 + 답글 수 + 좋아요 상태
    console.log('🔍 [Comments API] Starting unified comments query...')
    
    let query = supabaseServer
      .from('comment')
      .select(`
        *,
        author:member!comment_author_id_fkey (
          nickname,
          profile_image_url
        ),
        replies:comment!parent_comment_id (count)
      `, { count: 'exact' })
      .eq('post_id', postId)
      .is('deleted_at', null)
      .is('parent_comment_id', null)  // 최상위 댓글만
      .order('created_at', { ascending: true })
      .range((page - 1) * limit, page * limit - 1)  // 페이지네이션
    
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
          replies:comment!parent_comment_id (count),
          user_like:comment_like!left (id)
        `, { count: 'exact' })
        .eq('post_id', postId)
        .eq('user_like.member_id', currentUserId)
        .is('deleted_at', null)
        .is('parent_comment_id', null)  
        .order('created_at', { ascending: true })
        .range((page - 1) * limit, page * limit - 1)
    }
    
    const { data: comments, error: commentsError, count } = await query
    
    console.log('🔍 [Comments API] Comments query result:', { 
      comments: comments?.length, 
      count, 
      error: commentsError 
    })
    
    if (commentsError) {
      console.error('❌ [Comments API] Comments fetch error:', commentsError)
      const mappedError = mapApiError(commentsError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // 응답 데이터 변환: 좋아요 상태와 답글 수 추가
    const processedComments = (comments || []).map(comment => ({
      ...comment,
      isLiked: currentUserId ? (comment.user_like && comment.user_like.length > 0) : false,
      replyCount: comment.replies?.[0]?.count || 0,
      // 기존 replies 필드는 제거 (count만 필요)
      replies: undefined,
      user_like: undefined  // 클라이언트에 불필요한 데이터 제거
    }))
    
    console.log('🔍 [Comments API] Final result:', { 
      processedComments: processedComments.length, 
      count 
    })
    
    const totalPages = Math.ceil((count || 0) / limit)
    return NextResponse.json(createPaginatedResponse(processedComments, {
      total: count || 0,
      page: page,
      limit: limit,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }))
    
  } catch (error) {
    console.error('❌ [Comments API] Unexpected error:', error)
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      content,
      postId, 
      authorId, 
      parentId,
      replyToCommentId,
      replyToUserId,
      replyToUsername
    } = await request.json()
    
    if (!content || !postId || !authorId) {
      const mappedError = mapApiError({ message: 'Missing required fields', status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    const insertData: {
      content: string;
      post_id: string;
      author_id: string;
      parent_comment_id: string | null;
      reply_to_comment_id?: string;
      reply_to_user_id?: string;
      reply_to_username?: string;
    } = {
      content,
      post_id: postId,
      author_id: authorId,
      parent_comment_id: parentId || null,
    }
    
    // 대댓글 정보가 있으면 추가
    if (replyToCommentId) insertData.reply_to_comment_id = replyToCommentId
    if (replyToUserId) insertData.reply_to_user_id = replyToUserId
    if (replyToUsername) insertData.reply_to_username = replyToUsername
    
    const { data: comment, error } = await supabaseServer
      .from('comment')
      .insert(insertData)
      .select(`
        *,
        author:member!comment_author_id_fkey (
          nickname,
          profile_image_url
        )
      `)
      .single()
    
    if (error) {
      console.error('Comment creation error:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    return NextResponse.json(createSuccessResponse({ comment }), { status: 201 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}