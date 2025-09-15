// PaginatedResponse<ProductResponseDto> 직접 사용

// Import cross-feature DTO types
import type { ProductResponseDto } from '@/domains/product/types/dto/productResponseDto';

// Home API Response DTOs with Pagination
// PaginatedBestSellersResponseDto 제거됨, PaginatedResponse<ProductResponseDto> 직접 사용

// PaginatedPopularProductsResponseDto 제거됨, PaginatedResponse<ProductResponseDto> 직접 사용


// PaginatedRecommendedProductsResponseDto 제거됨, PaginatedResponse<ProductResponseDto> 직접 사용

// Combined response for home page data (non-paginated)
export interface HomeDataResponseDto {
  bestSellers: ProductResponseDto[];
  popularProducts: ProductResponseDto[];
}