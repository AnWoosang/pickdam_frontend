import { Product, ProductDetail, SellerInfo, LowestPriceHistory } from '@/domains/product/types/product';
import { AverageReviewInfo } from '@/domains/review/types/review';
import { ProductCategory, InhaleType } from '@/domains/product/types/category';
import {
  ProductResponseDto,
  SellerInfoResponseDto,
  PriceHistoryItemResponseDto
} from './productDto';
import { AverageReviewInfoResponseDto } from '@/domains/review/types/dto/reviewDto';


// DB 값을 enum으로 변환하는 헬퍼 함수들
function mapDbToProductCategory(dbValue: string): ProductCategory {
  // DB 저장값을 ProductCategory enum으로 매핑
  switch (dbValue) {
    case 'LIQUID':
      return ProductCategory.LIQUID;
    case 'DEVICE':
      return ProductCategory.DEVICE;
    case 'POD':
      return ProductCategory.POD;
    case 'COIL':
      return ProductCategory.COIL;
    case 'ACCESSORY':
      return ProductCategory.ACCESSORY;
    case 'ETC':
      return ProductCategory.ETC;
    default:
      // DB에서 온 값이 이미 enum 값과 일치하는지 확인 (한국어)
      if (Object.values(ProductCategory).includes(dbValue as ProductCategory)) {
        return dbValue as ProductCategory;
      }
      return ProductCategory.ETC;
  }
}

function mapDbToInhaleType(dbValue: string): InhaleType {
  // DB 저장값 ('MTL', 'DTL', 'NONE')을 InhaleType enum으로 변환
  switch (dbValue) {
    case 'MTL':
      return InhaleType.MTL;
    case 'DTL':
      return InhaleType.DTL;
    case 'NONE':
      return InhaleType.NONE;
    default:
      return InhaleType.NONE; // 기본값
  }
}

// ProductDto를 Product 도메인 타입으로 변환
export function toProduct(dto: ProductResponseDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    thumbnailImageUrl: dto.thumbnailImageUrl,
    productCategory: mapDbToProductCategory(dto.productCategory),
    inhaleType: mapDbToInhaleType(dto.inhaleType),
    capacity: dto.capacity,
    totalViews: dto.totalViews,
    totalFavorites: dto.totalFavorites,
    weeklyViews: dto.weeklyViews,
    brand: dto.brand,
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
    originalPrice: dto.originalPrice,
    shippingFee: dto.shippingFee,
    shippingFeeThreshold: dto.shippingFeeThreshold,
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
  // UTC timezone 문제 해결: 로컬 timezone 기준으로 Date 생성
  // '2025-11-07' → 2025-11-07 00:00:00 (로컬 시간)
  const [year, month, day] = dto.date.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);

  return {
    date: localDate,
    price: dto.price
  };
}



