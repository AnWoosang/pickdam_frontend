import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import { ProductResponseDto } from '@/domains/product/types/dto/productDto'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // 인기 상품 조회
    const { data, error } = await supabase
      .from('popular_products')
      .select('*')
      .limit(limit)    
    
    if (error) {
      const mappedError = mapApiError(error)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    // ProductResponseDto 형태로 변환
    const productDtos: ProductResponseDto[] = (data || []).map((item: unknown) => {
      const record = item as Record<string, unknown>;
      return {
        id: record.id,
        name: record.name,
        price: record.price,
        thumbnailImageUrl: record.thumbnail_image_url,
        productCategory: record.product_category,
        inhaleType: record.inhale_type,
        capacity: record.capacity,
        totalViews: record.total_views,
        totalFavorites: record.total_favorites,
        weeklyViews: record.weekly_views,
        brand: record.brand,
        isAvailable: record.is_available,
        description: record.description
      } as ProductResponseDto;
    })

    return NextResponse.json(createSuccessResponse(productDtos))

  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}