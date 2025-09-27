import { NextRequest, NextResponse } from 'next/server'
import { createPaginatedResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { MyReviewResponseDto } from '@/domains/user/types/dto/mypageDto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    // 총 개수 조회
    const { count, error: countError } = await supabase
      .from('review')
      .select('*', { count: 'exact', head: true })
      .eq('member_id', id)
      .is('deleted_at', null)
    
    if (countError) {
      throw countError
    }
    
    // 리뷰 목록 조회 (회원 정보 포함)
    const { data, error } = await supabase
      .from('review')
      .select(`
        id,
        member_id,
        product_id,
        rating,
        sweetness,
        menthol,
        throat_hit,
        body,
        freshness,
        content,
        created_at,
        member:member_id (
          nickname,
          profile_image_url
        ),
        product:product_id (
          id,
          name,
          thumbnail_image_url,
          brand
        )
      `)
      .eq('member_id', id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // 데이터 변환 (MyReviewResponseDto 형식으로)
    const transformedReviews: MyReviewResponseDto[] = data?.map(review => {
      const member = Array.isArray(review.member) ? review.member[0] : review.member as any;
      const product = Array.isArray(review.product) ? review.product[0] : review.product as any;

      return {
        id: review.id,
        userId: review.member_id,
        userName: member?.nickname || '알 수 없음',
        profileImage: member?.profile_image_url,
        rating: review.rating,
        sweetness: review.sweetness,
        menthol: review.menthol,
        throatHit: review.throat_hit,
        body: review.body,
        freshness: review.freshness,
        content: review.content,
        createdAt: review.created_at,
        productId: review.product_id,
        productName: product?.name
      };
    }) || [];

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json(createPaginatedResponse(transformedReviews, {
      total: count || 0,
      page: page,
      limit: limit,
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