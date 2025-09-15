import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {const { id } = await params
    
    const { data: post, error } = await supabaseServer
      .from('post')
      .select(`
        *,
        author:member!author_id (
          nickname,
          profile_image_url
        ),
        images:post_image(
          id,
          image_url,
          image_name,
          sort_order
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single()
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    return NextResponse.json(createSuccessResponse({ post }))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { title, content, categoryId, authorId, imageUrls } = await request.json()
    
    // 작성자 확인
    const { data: existingPost, error: fetchError } = await supabaseServer
      .from('post')
      .select('author_id')
      .eq('id', id)
      .is('deleted_at', null)
      .single()
    
    
    if (fetchError || !existingPost) {
      const mappedError = mapApiError({ message: 'Post not found', status: StatusCodes.NOT_FOUND })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    if (existingPost.author_id !== authorId) {
      const mappedError = mapApiError({ message: 'Unauthorized', status: StatusCodes.FORBIDDEN })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    const updateData: {
      title: string;
      content: string;
      updated_at: string;
      category?: string;
      thumbnail_image_url?: string | null;
    } = {
      title,
      content,
      updated_at: new Date().toISOString()
    }
    
    // categoryId가 제공되고 유효한 경우에만 업데이트
    if (categoryId && categoryId.trim() !== '') {
      updateData.category = categoryId;
    }
    
    // 이미지 URL이 제공된 경우 썸네일 설정
    if (imageUrls && imageUrls.length > 0) {
      updateData.thumbnail_image_url = imageUrls[0];
    } else {
      updateData.thumbnail_image_url = null;
    }
    
    const { data: post, error } = await supabaseServer
      .from('post')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        author:member!author_id (
          nickname,
          profile_image_url
        ),
        images:post_image(
          id,
          image_url,
          image_name,
          sort_order
        )
      `)
      .single()
    
    // 이미지가 정의된 경우 post_image 테이블 업데이트
    if (imageUrls !== undefined) {
      // 기존 이미지 삭제 - CASCADE + Trigger가 자동으로 스토리지 정리
      await supabaseServer
        .from('post_image')
        .delete()
        .eq('post_id', id)
      
      // 새 이미지 추가 (빈 배열이어도 처리)
      if (imageUrls && imageUrls.length > 0) {
        const imageInserts = imageUrls.map((url: string, index: number) => ({
          post_id: id,
          image_url: url,
          image_name: `image_${index + 1}`,
          sort_order: index + 1
        }))
        
        const { error: insertImagesError } = await supabaseServer
          .from('post_image')
          .insert(imageInserts)
        
        if (insertImagesError) {
          console.error('Error inserting new post images:', insertImagesError)
          // 이미지 업데이트 실패해도 게시글 업데이트는 성공으로 처리
        }
      }
    }
    
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    return NextResponse.json(createSuccessResponse({ post }))
    
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
    const { id } = await params
    const { authorId } = await request.json()
    
    // 작성자 확인
    const { data: existingPost, error: fetchError } = await supabaseServer
      .from('post')
      .select('author_id')
      .eq('id', id)
      .is('deleted_at', null)
      .single()
    
    if (fetchError || !existingPost) {
      const mappedError = mapApiError({ message: 'Post not found', status: StatusCodes.NOT_FOUND })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    if (existingPost.author_id !== authorId) {
      const mappedError = mapApiError({ message: 'Unauthorized', status: StatusCodes.FORBIDDEN })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // Soft delete - CASCADE + Trigger가 자동으로 관련 이미지 정리
    const { error } = await supabaseServer
      .from('post')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) {
      console.error('Post deletion error:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // CASCADE 제약조건과 Trigger가 자동으로:
    // 1. post_image 테이블의 관련 레코드 삭제
    // 2. Edge Function 호출하여 스토리지 파일 삭제
    
    return NextResponse.json(createSuccessResponse({ success: true }), { status: 204 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}