// 상품 카테고리 enum - 통합된 구조
export enum ProductCategory {
  LIQUID = 'liquid',
  DEVICE = 'device',
  POD = 'pod',
  COIL = 'coil',
  ACCESSORY = 'accessory',
}

// 메인 카테고리 enum
export enum MainCategory {
  LIQUID = 'liquid',
  DEVICE = 'device', 
  ACCESSORY = 'accessory'
}

// 흡입 방식 enum (enum 선언을 먼저 이동)
export enum InhaleType {
  MTL = 'MTL', // 입호흡
  DL = 'DL',   // 폐호흡
}

// 카테고리 매핑 정보
export interface CategoryInfo {
  id: string;
  name: string;
  mainCategory: MainCategory;
}


// 서브카테고리 매핑 타입
export interface SubCategoryMapping {
  name: string;
  displayName: string;
  inhaleType?: InhaleType; // 호흡방식과 매핑되는 경우
}

// 카테고리 그룹 정보 (업데이트)
export interface CategoryGroup {
  id: MainCategory;
  name: string;
  displayName: string;
  productCategories: ProductCategory[];
  subCategories: SubCategoryMapping[];
}

// 통합 카테고리 구조
export const CATEGORY_CONFIG: CategoryGroup[] = [
  {
    id: MainCategory.LIQUID,
    name: 'liquid',
    displayName: '액상',
    productCategories: [ProductCategory.LIQUID],
    subCategories: [
      { name: 'dl', displayName: '폐호흡', inhaleType: InhaleType.DL },
      { name: 'mtl', displayName: '입호흡', inhaleType: InhaleType.MTL }
    ]
  },
  {
    id: MainCategory.DEVICE,
    name: 'device', 
    displayName: '기기',
    productCategories: [ProductCategory.DEVICE],
    subCategories: [
      { name: 'dl', displayName: '폐호흡', inhaleType: InhaleType.DL },
      { name: 'mtl', displayName: '입호흡', inhaleType: InhaleType.MTL }
    ]
  },
  {
    id: MainCategory.ACCESSORY,
    name: 'accessory',
    displayName: '코일/팟/기타', 
    productCategories: [ProductCategory.POD, ProductCategory.COIL, ProductCategory.ACCESSORY],
    subCategories: [
      { name: 'coil', displayName: '코일' },
      { name: 'pod', displayName: '팟' },
      { name: 'other', displayName: '기타' }
    ]
  }
];

// 헬퍼 함수들
export const getCategoryDisplayName = (categoryId: string): string => {
  const config = CATEGORY_CONFIG.find(c => c.id === categoryId || c.name === categoryId);
  return config?.displayName || categoryId;
};

export const getProductCategoriesForMain = (mainCategory: MainCategory): ProductCategory[] => {
  const config = CATEGORY_CONFIG.find(c => c.id === mainCategory);
  return config?.productCategories || [];
};

export const getMainCategoryByProductCategory = (productCategory: ProductCategory): MainCategory => {
  const config = CATEGORY_CONFIG.find(c => c.productCategories.includes(productCategory));
  return config?.id || MainCategory.ACCESSORY;
};

// 서브카테고리 관련 헬퍼 함수들
export const getSubCategoryByName = (categoryId: MainCategory, subCategoryName: string): SubCategoryMapping | undefined => {
  const config = CATEGORY_CONFIG.find(c => c.id === categoryId);
  return config?.subCategories.find(sub => sub.name === subCategoryName);
};

export const getInhaleTypeFromSubCategory = (categoryId: MainCategory, subCategoryName: string): InhaleType | undefined => {
  const subCategory = getSubCategoryByName(categoryId, subCategoryName);
  return subCategory?.inhaleType;
};


// 호흡 방식 설정
export interface InhaleTypeConfig {
  id: InhaleType;
  name: string;
  displayName: string;
  description: string;
}

// 통합 호흡 방식 구조
export const INHALE_TYPE_CONFIG: InhaleTypeConfig[] = [
  {
    id: InhaleType.MTL,
    name: 'mtl',
    displayName: '입호흡(MTL)',
    description: 'Mouth To Lung - 담배와 같은 입호흡 방식'
  },
  {
    id: InhaleType.DL,
    name: 'dl',
    displayName: '폐호흡(DL)',
    description: 'Direct Lung - 직접 폐로 들이마시는 방식'
  }
];

// 호흡 방식 헬퍼 함수들
export const getInhaleTypeDisplayName = (inhaleTypeId: string): string => {
  const config = INHALE_TYPE_CONFIG.find(c => c.id === inhaleTypeId || c.name === inhaleTypeId);
  return config?.displayName || inhaleTypeId;
};

export const getInhaleTypeByName = (name: string): InhaleType | undefined => {
  const config = INHALE_TYPE_CONFIG.find(c => c.name === name);
  return config?.id;
};

// 정렬 기준 타입
export type SortBy = 'price' | 'popularity' | 'newest' | 'name';
export type SortOrder = 'asc' | 'desc';

// 기본 상품 인터페이스
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  productCategory: ProductCategory;
  inhaleType: InhaleType;
  flavor: string;
  capacity: string;
  totalViews: number;
  totalFavorites: number;
  brand?: string;
  isAvailable?: boolean;
}

// 상품 상세 정보 인터페이스
export interface ProductDetail extends Product {
  description?: string;
  thumbnailUrl: string;
  averageReviewInfo: AverageReviewInfo;
  sellers: SellerInfo[];
  reviews: Review[];
  lowestPriceHistory: LowestPriceHistory[];
  specifications?: Record<string, string>;
  tags?: string[];
}

// 판매자 정보 타입  
export interface Seller {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  deliveryFee?: number;
  deliveryDays?: string;
  rating?: number;
}

// 상세 판매자 정보
export interface SellerInfo {
  name: string;
  price: number;
  shippingFee: number;
  url: string;
}

// 리뷰 타입
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
  imageUrls?: string[];
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 리뷰 평가 정보
export interface ReviewRating {
  rating: number; // 전체 평점 (1-5)
  sweetness: number; // 달콤함 (1-5)
  menthol: number; // 멘솔감 (1-5)
  throatHit: number; // 목넘김 (1-5)
  body: number; // 바디감 (1-5)
  freshness: number; // 신선함 (1-5)
}

// 평균 리뷰 정보
export interface AverageReviewInfo extends ReviewRating {
  totalReviewCount: number;
}

// 가격 이력 정보
export interface LowestPriceHistory {
  date: string;
  price: number;
}

