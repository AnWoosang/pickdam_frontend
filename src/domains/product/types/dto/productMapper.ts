import { Product, ProductDetail, SellerInfo, LowestPriceHistory } from '@/domains/product/types/product';
import { AverageReviewInfo } from '@/domains/review/types/review';
import { ProductCategory, InhaleType } from '@/domains/product/types/category';
import { 
  ProductResponseDto,
  SellerInfoResponseDto,
  PriceHistoryItemResponseDto
} from './productResponseDto';
import { AverageReviewInfoResponseDto } from '@/domains/review/types/dto/reviewResponseDto';


// ProductDto를 Product 도메인 타입으로 변환
export function toProduct(dto: ProductResponseDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    thumbnailImageUrl: dto.thumbnailImageUrl,
    productCategory: dto.productCategory as ProductCategory,
    inhaleType: dto.inhaleType as InhaleType,
    flavor: dto.flavor,
    capacity: dto.capacity,
    totalViews: dto.totalViews,
    totalFavorites: dto.totalFavorites,
    weeklyViews: dto.weeklyViews,
    brand: dto.brand,
    isAvailable: dto.isAvailable
  };
}

// ProductDto를 ProductDetail 도메인 타입으로 변환
export function toProductDetail(
  dto: ProductResponseDto,
  sellersDto: SellerInfoResponseDto[] = [],
  averageReviewDto?: AverageReviewInfoResponseDto,
  priceHistoryDto: PriceHistoryItemResponseDto[] = []
): ProductDetail {
  return {
    ...toProduct(dto),
    description: dto.description,
    sellers: sellersDto.map(toSellerInfo),
    averageReviewInfo: averageReviewDto ? toAverageReviewInfo(averageReviewDto) : toAverageReviewInfo({} as AverageReviewInfoResponseDto),
    priceHistory: priceHistoryDto.map(toLowestPriceHistory)
  };
}

// SellerInfoResponseDto를 SellerInfo 도메인 타입으로 변환
export function toSellerInfo(dto: SellerInfoResponseDto): SellerInfo {
  return {
    name: dto.name,
    price: dto.price,
    shippingFee: dto.shippingFee,
    url: dto.url
  };
}

// AverageReviewResponseDto를 AverageReviewInfo 도메인 타입으로 변환
export function toAverageReviewInfo(dto: AverageReviewInfoResponseDto): AverageReviewInfo {
  return {
    totalReviewCount: dto.totalReviews || 0,
    rating: dto.averageRating || 0,
    sweetness: dto.averageSweetness || 0,
    menthol: dto.averageMenthol || 0,
    throatHit: dto.averageThroatHit || 0,
    body: dto.averageBody || 0,
    freshness: dto.averageFreshness || 0,
    ratingDistribution: dto.ratingDistribution
      ? [
          { stars: 1, count: dto.ratingDistribution[1] || 0 },
          { stars: 2, count: dto.ratingDistribution[2] || 0 },
          { stars: 3, count: dto.ratingDistribution[3] || 0 },
          { stars: 4, count: dto.ratingDistribution[4] || 0 },
          { stars: 5, count: dto.ratingDistribution[5] || 0 }
        ]
      : []
  };
}

// PriceHistoryItemResponseDto를 LowestPriceHistory 도메인 타입으로 변환
export function toLowestPriceHistory(dto: PriceHistoryItemResponseDto): LowestPriceHistory {
  return {
    date: dto.date,
    price: dto.price
  };
}



