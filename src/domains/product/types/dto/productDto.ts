import { SortBy, SortOrder } from '../product';
import { AverageReviewInfoResponseDto } from '@/domains/review/types/dto/reviewDto';

// Product API Request DTOs
export interface ProductsRequestParamDto {
  page?: number;
  limit?: number;
  category?: string;
  categories?: string[];
  inhaleType?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

// Product API Response DTOs
export interface ProductResponseDto {
  id: string;
  name: string;
  price: number;
  thumbnailImageUrl: string;
  productCategory: string; // API에서는 string으로 받음
  inhaleType: string; // API에서는 string으로 받음
  capacity: number;
  totalViews: number;
  totalFavorites: number;
  weeklyViews: number;
  brand?: string;
  isAvailable?: boolean;
  description?: string;
}

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