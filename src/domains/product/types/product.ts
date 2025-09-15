import { ProductCategory } from './category';
import { AverageReviewInfo } from '@/domains/review/types/review';

// 정렬 기준 타입 (데이터베이스 필드명 기준)
export type SortBy = 'price' | 'total_views' | 'created_at' | 'name';
export type SortOrder = 'asc' | 'desc';

// 정렬 기준 UI 표시명
export const SORT_BY_OPTIONS: Record<SortBy, string> = {
  'total_views': '인기순',
  'price': '가격순', 
  'created_at': '최신순',
  'name': '이름순'
};

// 정렬 기준 검증
export const isValidSortBy = (value: string): value is SortBy => {
  return value in SORT_BY_OPTIONS;
};

// 정렬 순서 검증
export const isValidSortOrder = (value: string): value is SortOrder => {
  return value === 'asc' || value === 'desc';
};

// 호흡방식 ID -> 표시명 매핑 (community.ts 패턴 적용)
export const INHALE_TYPE_NAMES: Record<string, string> = {
  'MTL': '입호흡(MTL)',
  'DL': '폐호흡(DL)'
};

// 호흡방식 ID 목록
export const INHALE_TYPE_IDS = Object.keys(INHALE_TYPE_NAMES);

// 호흡방식 URL -> ID 매핑 (DB 저장용)
export const INHALE_TYPE_URL_TO_ID: Record<string, string> = {
  'dl': 'DL',
  'mtl': 'MTL'
};

// 호흡방식 ID -> URL 매핑 (URL 생성용)
export const INHALE_TYPE_ID_TO_URL: Record<string, string> = {
  'DL': 'dl',
  'MTL': 'mtl'
};

// 검증 함수들
export const isValidInhaleTypeId = (id: string): boolean => {
  return id in INHALE_TYPE_NAMES;
};

export const isValidInhaleTypeUrl = (value: string): boolean => {
  return value in INHALE_TYPE_URL_TO_ID;
};

// 변환 함수들
export const getInhaleTypeName = (id: string | undefined): string => {
  if (!id) return '알 수 없음';
  return INHALE_TYPE_NAMES[id] || '알 수 없음';
};

export const mapUrlToInhaleTypeIds = (urlValue: string | null): string[] => {
  if (!urlValue || !isValidInhaleTypeUrl(urlValue)) return [];
  return [INHALE_TYPE_URL_TO_ID[urlValue]];
};

export const mapInhaleTypeIdToUrl = (id: string): string | undefined => {
  return INHALE_TYPE_ID_TO_URL[id];
};

// 기본 상품 인터페이스
export interface Product {
  id: string;
  name: string;
  price: number;
  thumbnailImageUrl: string;
  productCategory: ProductCategory;
  inhaleType: string; // DB ID 저장 ('MTL', 'DL')
  flavor: string;
  capacity: string;
  totalViews: number;
  totalFavorites: number;
  weeklyViews: number; // 1주일전 조회수 필드 추가
  brand?: string;
  isAvailable?: boolean;
}

// 상품 상세 정보 인터페이스
export interface ProductDetail extends Product {
  description?: string;
  averageReviewInfo: AverageReviewInfo;
  sellers: SellerInfo[];
  priceHistory: LowestPriceHistory[];
}

// 상세 판매자 정보
export interface SellerInfo {
  name: string;
  price: number;
  shippingFee: number;
  url: string;
}

// 가격 이력 정보
export interface LowestPriceHistory {
  date: string;
  price: number;
}

// 가격 히스토리 데이터 인터페이스
export interface PriceHistoryData {
  productId: string;
  priceHistory: LowestPriceHistory[];
}

// 상품 목록 응답 타입
export interface ProductListResult {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}