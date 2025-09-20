import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'
import { CreateReviewRequestDto } from '@/domains/review/types/dto/reviewDto'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const requestData: CreateReviewRequestDto = await request.json()
    const { images, throatHit, ...otherUpdates } = requestData

    // RPC 함수 호출로 원자적 업데이트 (order 포함)
    const { data: result, error: rpcError } = await supabaseServer
      .rpc('update_review_with_images', {
        p_review_id: id,
        p_content: otherUpdates.content,
        p_rating: otherUpdates.rating,
        p_sweetness: otherUpdates.sweetness,
        p_menthol: otherUpdates.menthol,
        p_throat_hit: throatHit,
        p_body: otherUpdates.body,
        p_freshness: otherUpdates.freshness,
        p_images: images || null
      })

    if (rpcError) {
      const mappedError = mapApiError(rpcError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // RPC에서 반환된 결과 확인
    if (!result?.success) {
      const errorCode = result?.error?.code || 'DATABASE_ERROR'
      const errorMessage = result?.error?.message || '리뷰 수정에 실패했습니다.'

      const mappedError = mapApiError({ code: errorCode, message: errorMessage })
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // RPC에서 반환된 데이터를 ReviewResponseDto 형태로 변환
    const reviewResponse = {
      id: result.data.id,
      productId: result.data.productId || "", // productId가 없다면 빈 문자열로 기본값 설정
      userId: result.data.userId,
      userName: result.data.userName,
      profileImage: result.data.profileImage,
      rating: result.data.rating,
      sweetness: result.data.sweetness,
      menthol: result.data.menthol,
      throatHit: result.data.throatHit,
      body: result.data.body,
      freshness: result.data.freshness,
      content: result.data.content,
      createdAt: result.data.createdAt,
      images: result.data.images || []
    };

    return NextResponse.json(createSuccessResponse(reviewResponse))

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
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
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // CASCADE 제약조건과 Trigger가 자동으로:
    // 1. review_image 테이블의 관련 레코드 삭제
    // 2. Edge Function 호출하여 스토리지 파일 삭제
    
    return new NextResponse(null, { status: 204 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}