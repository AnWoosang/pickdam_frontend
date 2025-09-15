import { AverageReviewInfoResponseDto } from '@/domains/review/types/dto/reviewResponseDto';

// Product API Response DTOs
export interface ProductResponseDto {
  id: string;
  name: string;
  price: number;
  thumbnailImageUrl: string;
  productCategory: string; // API에서는 string으로 받음
  inhaleType: string; // API에서는 string으로 받음
  flavor: string;
  capacity: string;
  totalViews: number;
  totalFavorites: number;
  weeklyViews: number;
  brand?: string;
  isAvailable?: boolean;
  description?: string;
}

// Product Detail API Response DTO (상품 상세 조회용)
export interface ProductDetailResponseDto {
  product: ProductResponseDto;
  sellers: SellerInfoResponseDto[];
  averageReviewInfo: AverageReviewInfoResponseDto;
  priceHistory: PriceHistoryItemResponseDto[];
}

export interface SellerInfoResponseDto {
  name: string;
  price: number;
  shippingFee: number;
  url: string;
}

export interface PriceHistoryItemResponseDto {
  date: string;
  price: number;
}

export interface IncrementViewResponseDto {
  success: boolean;
  incremented: boolean;
  newViewCount: number;
  reason?: string;
}

export interface ToggleWishlistResponseDto {
  success: boolean;
  isWishlisted: boolean;
  newFavoriteCount: number;
}