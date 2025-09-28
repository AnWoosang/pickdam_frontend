import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import {
  createPaginatedResponse,
  createErrorResponse,
  mapApiError,
} from '@/infrastructure/api/supabaseResponseUtils'
import { ProductResponseDto } from '@/domains/product/types/dto/productDto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params
    const { searchParams } = new URL(request.url)

    // 페이지네이션 파라미터
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = (page - 1) * limit

    // 한 번의 쿼리로 데이터와 총 개수 동시 조회
    const { data: wishlistItems, error, count: totalCount } = await supabase
      .from('wishlist')
      .select(`
        id,
        created_at,
        product:product_id (
          id, name, price, thumbnail_image_url, product_category,
          inhale_type, capacity, brand, total_views,
          total_favorites
        )
      `, { count: 'exact' })
      .eq('member_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    // ProductResponseDto 형태로 변환 (wishlist 정보 포함)
    const products: (ProductResponseDto & { wishlistId: string; wishlistCreatedAt: string })[] = wishlistItems
      ?.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          thumbnailImageUrl: item.product.thumbnail_image_url,
          productCategory: item.product.product_category,
          inhaleType: item.product.inhale_type,
          capacity: item.product.capacity,
          brand: item.product.brand,
          totalViews: item.product.total_views,
          totalFavorites: item.product.total_favorites,
          weeklyViews: 0, // 위시리스트에서는 기본값
          wishlistId: item.id,
          wishlistCreatedAt: item.created_at
        })) || []
    
    const totalPages = Math.ceil((totalCount || 0) / limit);
    return NextResponse.json(createPaginatedResponse(products, {
      total: totalCount || 0,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params
    const body = await request.json()
    const { productIds } = body

    // IN 절을 사용한 벌크 삭제
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('member_id', id)
      .in('product_id', productIds)
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }
    
    return new NextResponse(null, { status: 204 })
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}

