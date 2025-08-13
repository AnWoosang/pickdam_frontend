import { ProductCategory } from './product';

// 검색 관련 타입 정의

// 검색용 상품 미리보기 인터페이스
export interface ProductPreview {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  productCategory: ProductCategory;
  inhaleType: string;
  flavor: string;
  brand: string;
  capacity: string;
  totalViews: number;
  totalFavorites: number;
}

// 검색 필터 인터페이스
export interface SearchFilters {
  categories: string[];
  brands: string[];
  inhaleTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: SearchSortBy;
  sortOrder: 'asc' | 'desc';
}

// 정렬 옵션
export type SearchSortBy = 'price' | 'popularity' | 'newest' | 'name';

// 검색 결과 인터페이스
export interface SearchResult {
  products: ProductPreview[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: SearchFilters;
}

// 검색 쿼리 파라미터
export interface SearchParams {
  keyword?: string;
  category?: string;
  brand?: string;
  inhaleType?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SearchSortBy;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// 최근 검색어 인터페이스
export interface RecentSearch {
  id: string;
  keyword: string;
  searchedAt: string;
}

// 추천 키워드 인터페이스
export interface RecommendedKeyword {
  id: string;
  keyword: string;
  category?: string;
  popularity?: number;
}

// 인기 키워드 인터페이스
export interface TrendingKeyword {
  id: string;
  keyword: string;
  rank: number;
  changeStatus: 'up' | 'down' | 'same' | 'new';
  searchCount: number;
}

// 검색 제안 인터페이스
export interface SearchSuggestion {
  type: 'keyword' | 'product' | 'brand' | 'category';
  value: string;
  label: string;
  count?: number;
}

// 페이지네이션 인터페이스
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}