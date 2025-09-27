import { NextRequest, NextResponse } from 'next/server'
import { createPaginatedResponse, createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { CreateReviewRequestDto, ReviewResponseDto } from '@/domains/review/types/dto/reviewDto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const offset = (page - 1) * limit

    const { data: reviewsData, error: reviewsError, count } = await supabase
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
      const mappedError = mapApiError(reviewsError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // ReviewResponseDto 형태로 변환
    const reviews: ReviewResponseDto[] = reviewsData?.map(item => {
      // 리뷰 이미지들을 순서대로 정렬하여 구조화된 객체 배열로 변환
      const images = item.review_image
        ?.sort((a: { image_order: number }, b: { image_order: number }) => a.image_order - b.image_order)
        ?.map((img: { image_url: string, image_order: number }) => ({
          imageUrl: img.image_url,
          imageOrder: img.image_order
        })) || [];

      return {
        id: item.id,
        productId: id,
        memberId: item.member_id,
        nickname: item.member?.nickname || '탈퇴한 사용자',
        profileImageUrl: item.member?.profile_image_url,
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
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id: productId } = await params
    const requestData: CreateReviewRequestDto = await request.json()

    // 이미지 데이터를 RPC 함수 형식에 맞게 변환
    const mappedImages = (requestData.images || []).map(img => ({
      image_url: img.imageUrl,
      image_order: img.imageOrder
    }));

    // RPC 함수 호출
    const { data: reviewResult, error: reviewError } = await supabase
      .rpc('create_review_with_images', {
        p_product_id: productId,
        p_member_id: requestData.memberId,
        p_rating: requestData.rating,
        p_content: requestData.content,
        p_sweetness: requestData.sweetness,
        p_menthol: requestData.menthol,
        p_throat_hit: requestData.throatHit,
        p_body: requestData.body,
        p_freshness: requestData.freshness,
        p_images: mappedImages
      })
    
    if (reviewError) {
      const mappedError = mapApiError(reviewError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }


    // 사용자 정보와 이미지 정보를 별도로 조회 (RPC에서 반환하지 않음)
    const { data: memberData } = await supabase
      .from('member')
      .select('nickname, profile_image_url')
      .eq('id', requestData.memberId)
      .single();

    const { data: imageData } = await supabase
      .from('review_image')
      .select('image_url, image_order')
      .eq('review_id', reviewResult.id)
      .order('image_order');

    // RPC에서 반환된 데이터를 ReviewResponseDto 형태로 변환 (snake_case → camelCase)
    const reviewResponse: ReviewResponseDto = {
      id: reviewResult.id,
      productId: reviewResult.product_id,
      memberId: reviewResult.member_id,
      nickname: memberData?.nickname || '',
      profileImageUrl: memberData?.profile_image_url || null,
      rating: reviewResult.rating,
      sweetness: reviewResult.sweetness,
      menthol: reviewResult.menthol,
      throatHit: reviewResult.throat_hit,
      body: reviewResult.body,
      freshness: reviewResult.freshness,
      content: reviewResult.content,
      createdAt: reviewResult.created_at,
      images: (imageData || []).map((img: { image_url: string; image_order: number }) => ({
        imageUrl: img.image_url,
        imageOrder: img.image_order
      }))
    };

    return NextResponse.json(createSuccessResponse(reviewResponse), { status: 201 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}