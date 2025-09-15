// 상품 카테고리 enum - 통합된 구조
export enum ProductCategory {
  LIQUID = '액상',
  DEVICE = '기기',
  POD = '팟',
  COIL = '코일',
  ACCESSORY = '악세서리',
}

// 메인 카테고리 enum
export enum MainCategory {
  LIQUID = '액상',
  DEVICE = '기기', 
  ACCESSORY = '악세서리'
}

// 흡입 방식 enum
export enum InhaleType {
  MTL = '입호흡', // 입호흡
  DL = '폐호흡',   // 폐호흡
}

// 서브카테고리 매핑 타입
export interface SubCategoryMapping {
  name: string;
  displayName: string;
  inhaleType?: InhaleType; // 호흡방식과 매핑되는 경우
}

// 카테고리 그룹 정보
export interface CategoryGroup {
  id: MainCategory;
  name: string;
  displayName: string;
  productCategories: ProductCategory[];
  subCategories: SubCategoryMapping[];
}

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

// 통합 카테고리 구조 (INHALE_TYPE_CONFIG를 활용)
export const CATEGORY_CONFIG: CategoryGroup[] = [
  {
    id: MainCategory.LIQUID,
    name: 'liquid',
    displayName: '액상',
    productCategories: [ProductCategory.LIQUID],
    subCategories: INHALE_TYPE_CONFIG.map(config => ({
      name: config.name,
      displayName: config.displayName,
      inhaleType: config.id
    }))
  },
  {
    id: MainCategory.DEVICE,
    name: 'device', 
    displayName: '기기',
    productCategories: [ProductCategory.DEVICE],
    subCategories: INHALE_TYPE_CONFIG.map(config => ({
      name: config.name,
      displayName: config.displayName,
      inhaleType: config.id
    }))
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

// 호흡 방식 헬퍼 함수들
export const getInhaleTypeDisplayName = (inhaleTypeId: string): string => {
  const config = INHALE_TYPE_CONFIG.find(c => c.id === inhaleTypeId || c.name === inhaleTypeId);
  return config?.displayName || inhaleTypeId;
};

export const getInhaleTypeByName = (name: string): InhaleType | undefined => {
  const config = INHALE_TYPE_CONFIG.find(c => c.name === name);
  return config?.id;
};

// 헤더용 카테고리 그룹 타입 정의
export interface HeaderCategoryGroup {
  title: string;
  categories: string[];
  id?: MainCategory; // 추가: 통합 시스템과 매핑을 위한 ID
}

// 헤더 카테고리바용 - 통합된 데이터 구조 사용
export const headerCategories: HeaderCategoryGroup[] = [
  {
    title: '모든 상품 보기',
    categories: [],
  },
  ...CATEGORY_CONFIG.map(config => ({
    title: config.displayName,
    categories: config.subCategories.map(sub => sub.displayName), // '전체보기' 제거
    id: config.id
  }))
];

// 실제 상품 카테고리용 - "전체보기" 제외, 통합된 데이터 구조 사용
export const productCategories = CATEGORY_CONFIG.map(config => ({
  title: config.displayName,
  categories: config.subCategories.map(sub => sub.displayName),
  id: config.id
}));

// 기존 호환성을 위한 export (헤더용으로 사용)
export const allCategories = headerCategories;