import { ProductCategory, InhaleType } from './category';
import { AverageReviewInfo } from '@/domains/review/types/review';

// 정렬 기준 타입 (camelCase)
export type SortBy = 'price' | 'totalViews' | 'createdAt' | 'name';
export type SortOrder = 'asc' | 'desc';

// 기본 상품 인터페이스
export interface Product {
  id: string;
  name: string;
  price: number;
  thumbnailImageUrl: string;
  productCategory: ProductCategory; // enum 타입 사용
  inhaleType: InhaleType; // enum 타입 사용 (DB는 'MTL', 'DL'로 저장)
  capacity: number;
  totalViews: number;
  totalFavorites: number;
  weeklyViews: number; // 1주일전 조회수 필드 추가
  brand?: string;
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
  originalPrice?: number;
  shippingFee: number;
  shippingFeeThreshold?: number;
  url: string;
}

// 가격 이력 정보
export interface LowestPriceHistory {
  date: Date;
  price: number;
}