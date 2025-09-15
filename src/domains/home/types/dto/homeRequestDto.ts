// Home API Request DTOs
export interface BestSellersRequestDto {
  limit?: number;
}

export interface PopularProductsRequestDto {
  limit?: number;
}


export interface RecommendedProductsRequestDto {
  category?: string;
  limit?: number;
  sortBy?: string;
}