import { NextRequest, NextResponse } from 'next/server'
import { createPaginatedResponse, createSuccessResponse, createErrorResponse, mapApiError, getStatusFromErrorCode } from '@/infrastructure/api/supabaseResponseUtils'
import { supabaseServer } from '@/infrastructure/api/supabaseServer'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {const { id } = await params
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const offset = (page - 1) * limit
    
    const { data: reviewsData, error: reviewsError, count } = await supabaseServer
      .from('review')
      .select(`
        *,
        member!inner (
          nickname,
          profile_image_url
        ),
        review_image:review_image (
          image_url,
          image_order
        )
      `, { count: 'exact' })
      .eq('product_id', id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (reviewsError) {
      console.error('Reviews fetch error:', reviewsError)
      const mappedError = mapApiError(reviewsError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    // 리뷰 데이터 변환
    const reviews = reviewsData?.map(item => {
      // 리뷰 이미지들을 순서대로 정렬하여 구조화된 객체 배열로 변환
      const images = item.review_image
        ?.sort((a: { image_order: number }, b: { image_order: number }) => a.image_order - b.image_order)
        ?.map((img: { image_url: string, image_order: number }) => ({
          url: img.image_url,
          order: img.image_order
        })) || [];

      return {
        id: item.id,
        userId: item.member_id,
        userName: item.member?.nickname || '탈퇴한 사용자',
        profileImage: item.member?.profile_image_url,
        rating: item.rating,
        sweetness: item.sweetness || 0,
        menthol: item.menthol || 0,
        throatHit: item.throat_hit || 0,
        body: item.body || 0,
        freshness: item.freshness || 0,
        content: item.content,
        createdAt: item.created_at,
        images: images
      };
    }) || []
    
    const totalPages = Math.ceil((count || 0) / limit);
    return NextResponse.json(createPaginatedResponse(reviews, {
      total: count || 0,
      page,
      limit,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const { images, throatHit, ...reviewData } = await request.json()
    
    // RPC 함수 호출
    const { data: reviewResult, error: reviewError } = await supabaseServer
      .rpc('create_review_with_images', {
        p_product_id: productId,
        p_member_id: reviewData.memberId,
        p_rating: reviewData.rating,
        p_content: reviewData.content,
        p_sweetness: reviewData.sweetness,
        p_menthol: reviewData.menthol,
        p_throat_hit: throatHit,
        p_body: reviewData.body,
        p_freshness: reviewData.freshness,
        p_images: images || []
      })
    
    if (reviewError) {
      console.error('Review creation error:', reviewError)
      const mappedError = mapApiError(reviewError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
    }
    
    return NextResponse.json(createSuccessResponse({ review: reviewResult }), { status: 201 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: getStatusFromErrorCode(mappedError.code) })
  }
}