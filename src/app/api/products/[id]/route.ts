import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientWithCookie } from "@/infrastructure/api/supabaseClient";
import {
  ProductResponseDto,
  ProductDetailResponseDto,
  SellerInfoResponseDto,
  PriceHistoryItemResponseDto
} from '@/domains/product/types/dto/productDto'
import { AverageReviewInfoResponseDto } from '@/domains/review/types/dto/reviewDto'
import { createSuccessResponse, createErrorResponse, mapApiError } from '@/infrastructure/api/supabaseResponseUtils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseClientWithCookie()
    const { id } = await params

    // RPC 함수로 모든 데이터 한번에 가져오기
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('get_product_detail', { p_product_id: id })
    
    if (rpcError) {
      const mappedError = mapApiError(rpcError)
      const errorResponse = createErrorResponse(mappedError)
      return NextResponse.json(errorResponse, { status: mappedError.statusCode })
    }

    const product = rpcResult.product
    
    // ProductDto 변환
    const productDto: ProductResponseDto = {
      id: product.id,
      name: product.name,
      price: product.price,
      thumbnailImageUrl: product.thumbnail_image_url,
      productCategory: product.product_category,
      inhaleType: product.inhale_type,
      capacity: product.capacity,
      totalViews: product.total_views || 0,
      totalFavorites: product.total_favorites || 0,
      weeklyViews: product.weekly_views || 0,
      brand: product.brand,
      isAvailable: product.is_available,
      description: product.description
    }
    
    // SellerInfo DTO 변환 (RPC 결과에서)
    const sellersDto: SellerInfoResponseDto[] = (rpcResult.sellers || []).map((seller: { seller_name?: string; price: number; shipping_fee?: number; store_url: string }) => ({
      name: seller.seller_name || 'Unknown Seller',
      price: seller.price,
      shippingFee: seller.shipping_fee || 0,
      url: seller.store_url
    }))
    
    // AverageReviewInfo DTO 변환 (RPC 결과에서)
    const averageDto: AverageReviewInfoResponseDto = rpcResult.averageReviewInfo ? {
      totalReviews: rpcResult.averageReviewInfo.total_reviews || 0,
      averageRating: rpcResult.averageReviewInfo.average_rating || 0,
      averageSweetness: rpcResult.averageReviewInfo.average_sweetness,
      averageMenthol: rpcResult.averageReviewInfo.average_menthol,
      averageThroatHit: rpcResult.averageReviewInfo.average_throat_hit,
      averageBody: rpcResult.averageReviewInfo.average_body,
      averageFreshness: rpcResult.averageReviewInfo.average_freshness,
      ratingDistribution: rpcResult.averageReviewInfo.rating_distribution
    } : {
      totalReviews: 0,
      averageRating: 0,
      averageSweetness: 0,
      averageMenthol: 0,
      averageThroatHit: 0,
      averageBody: 0,
      averageFreshness: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
    
    // PriceHistory DTO 변환 (RPC 결과에서)
    const priceHistoryDto: PriceHistoryItemResponseDto[] = (rpcResult.priceHistory || []).map((item: { date: string; price: number }) => ({
      date: item.date,
      price: Number(item.price)
    }))
    
    // ProductDetailResponseDto 구성
    const response: ProductDetailResponseDto = {
      product: productDto,
      sellers: sellersDto,
      averageReviewInfo: averageDto,
      priceHistory: priceHistoryDto
    }
    
    return NextResponse.json(createSuccessResponse(response))
    
  } catch (error) {
    const mappedError = mapApiError(error)
    const errorResponse = createErrorResponse(mappedError)
    return NextResponse.json(errorResponse, { status: mappedError.statusCode })
  }
}