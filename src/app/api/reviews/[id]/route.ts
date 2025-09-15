import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {const { id } = await params
    const { imageUrls, throatHit, ...otherUpdates } = await request.json()
    
    // camelCase를 snake_case로 변환
    const reviewUpdates = {
      ...otherUpdates,
      ...(throatHit !== undefined && { throat_hit: throatHit })
    }
    
    // 리뷰 기본 정보 업데이트
    const { data: reviewData, error: reviewError } = await supabaseServer
      .from('review')
      .update(reviewUpdates)
      .eq('id', id)
      .select()
      .single()
    
    if (reviewError) {
      console.error('Review update error:', reviewError)
      const mappedError = mapApiError(reviewError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }

    // 이미지가 있다면 이미지 업데이트 처리
    if (imageUrls !== undefined) {
      // 기존 이미지 삭제 - CASCADE + Trigger가 자동으로 스토리지 정리
      await supabaseServer
        .from('review_image')
        .delete()
        .eq('review_id', id)
      
      // 새 이미지 추가
      if (imageUrls && imageUrls.length > 0) {
        const imageData = imageUrls.map((url: string, index: number) => ({
          review_id: id,
          image_url: url,
          image_order: index + 1
        }))
        
        const { error: imageError } = await supabaseServer
          .from('review_image')
          .insert(imageData)
        
        if (imageError) {
          console.error('Review image update error:', imageError)
          // 이미지 업데이트 실패해도 리뷰 업데이트는 성공으로 처리
        }
      }
    }
    
    return NextResponse.json(createSuccessResponse({ review: reviewData }))
    
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
    
    // Soft delete - CASCADE + Trigger가 자동으로 관련 이미지 정리
    const { error } = await supabaseServer
      .from('review')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) {
      console.error('Review deletion error:', error)
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // CASCADE 제약조건과 Trigger가 자동으로:
    // 1. review_image 테이블의 관련 레코드 삭제
    // 2. Edge Function 호출하여 스토리지 파일 삭제
    
    return NextResponse.json(createSuccessResponse({ success: true }), { status: 204 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}