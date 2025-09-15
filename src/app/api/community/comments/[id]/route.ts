import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { content, authorId } = await request.json()
    const { id: commentId } = await params
    
    if (!content || !commentId || !authorId) {
      const mappedError = mapApiError({ message: 'Missing required fields', status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    const { data: comment, error } = await supabaseServer
      .from('comment')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .eq('author_id', authorId) // 작성자만 수정 가능
      .is('deleted_at', null)
      .select(`
        *,
        author:member!comment_author_id_fkey (
          nickname,
          profile_image_url
        )
      `)
      .single()
    
    if (error) {
      console.error('Comment update error:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    return NextResponse.json(createSuccessResponse({ comment }))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorId } = await request.json()
    const { id: commentId } = await params
    
    if (!commentId || !authorId) {
      const mappedError = mapApiError({ message: 'Comment ID and authorId are required', status: StatusCodes.BAD_REQUEST })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // Check if comment exists and get replies count
    const { data: existingComment, error: fetchError } = await supabaseServer
      .from('comment')
      .select(`
        *,
        replies:comment!parent_comment_id(id)
      `)
      .eq('id', commentId)
      .eq('author_id', authorId) // 작성자만 삭제 가능
      .is('deleted_at', null)
      .single()
    
    if (fetchError || !existingComment) {
      console.error('Comment fetch error:', fetchError)
      const mappedError = mapApiError({ message: 'Comment not found', status: StatusCodes.NOT_FOUND })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // Check if comment has replies
    const hasReplies = existingComment.replies && existingComment.replies.length > 0
    
    // Update comment based on whether it has replies
    const updateData = hasReplies 
      ? { 
          content: '삭제된 댓글입니다.',
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      : { 
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
    
    const { error: deleteError } = await supabaseServer
      .from('comment')
      .update(updateData)
      .eq('id', commentId)
    
    if (deleteError) {
      console.error('Comment delete error:', deleteError)
      const mappedError = mapApiError(deleteError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // Update post comment count
    try {
      const { data: currentPost } = await supabaseServer
        .from('post')
        .select('comment_count')
        .eq('id', existingComment.post_id)
        .single()
      
      await supabaseServer
        .from('post')
        .update({ 
          comment_count: Math.max((currentPost?.comment_count || 0) - 1, 0)
        })
        .eq('id', existingComment.post_id)
    } catch (countError) {
      console.warn('Comment count update failed:', countError)
    }
    
    return NextResponse.json(createSuccessResponse({ success: true }), { status: 204 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}