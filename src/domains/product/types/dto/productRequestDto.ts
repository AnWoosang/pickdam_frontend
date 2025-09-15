import { SortBy, SortOrder } from '../product';

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

export interface AddToWishlistRequestDto {
  productId: string;
}

export interface RemoveFromWishlistRequestDto {
  productId: string;
}

export interface IncrementViewRequestDto {
  memberId?: string;
  anonymousId?: string;
}

export interface ToggleWishlistRequestDto {
  memberId: string;
}