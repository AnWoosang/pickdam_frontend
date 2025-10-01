// 상품 카테고리 enum - 통합된 구조
export enum ProductCategory {
  LIQUID = '액상',
  DEVICE = '기기',
  POD = '팟',
  COIL = '코일',
  ACCESSORY = '악세서리',
  ETC = '기타',
}

// 메인 카테고리 enum
export enum MainCategory {
  LIQUID = '액상',
  DEVICE = '기기',
  OTHER = '코일/팟/기타'
}

// 흡입 방식 enum
export enum InhaleType {
  MTL = '입호흡',
  DTL = '폐호흡',
  NONE = '없음',
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
    name: 'MTL',
    displayName: '입호흡(MTL)',
    description: 'Mouth To Lung - 담배와 같은 입호흡 방식'
  },
  {
    id: InhaleType.DTL,
    name: 'DTL',
    displayName: '폐호흡(DTL)',
    description: 'Direct To Lung - 직접 폐로 들이마시는 방식'
  },
  {
    id: InhaleType.NONE,
    name: 'NONE',
    displayName: '해당없음',
    description: '흡입 방식이 적용되지 않는 제품'
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
    id: MainCategory.OTHER,
    name: 'other',
    displayName: '코일/팟/기타',
    productCategories: [ProductCategory.POD, ProductCategory.COIL, ProductCategory.ACCESSORY, ProductCategory.ETC],
    subCategories: []
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
  return config?.id || MainCategory.OTHER;
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
export const getInhaleTypeDisplayName = (inhaleType: InhaleType | string): string => {
  // InhaleType enum 값을 직접 받는 경우
  if (typeof inhaleType === 'string' && Object.values(InhaleType).includes(inhaleType as InhaleType)) {
    const config = INHALE_TYPE_CONFIG.find(c => c.id === inhaleType);
    return config?.displayName || inhaleType;
  }

  // DB 저장값 ('MTL', 'DL')을 받는 경우
  const config = INHALE_TYPE_CONFIG.find(c => c.name === inhaleType);
  return config?.displayName || (typeof inhaleType === 'string' ? inhaleType : '알 수 없음');
};

export const getInhaleTypeByName = (name: string): InhaleType | undefined => {
  const config = INHALE_TYPE_CONFIG.find(c => c.name === name);
  return config?.id;
};

// ProductCategory 헬퍼 함수들
export const getProductCategoryDisplayName = (category: ProductCategory | string): string => {
  // ProductCategory enum 값인 경우 그대로 반환 (이미 표시명임)
  if (typeof category === 'string' && Object.values(ProductCategory).includes(category as ProductCategory)) {
    return category;
  }

  return typeof category === 'string' ? category : '알 수 없음';
};

// 헤더/필터링용 통합 카테고리 구조
export interface CategoryGroupForUI {
  title: string;
  categories: string[];
  id?: MainCategory;
}

// 헤더 카테고리바용 - "모든 상품 보기" 포함
export const getHeaderCategories = (): CategoryGroupForUI[] => [
  {
    title: '모든 상품 보기',
    categories: [],
  },
  ...CATEGORY_CONFIG.map(config => ({
    title: config.displayName,
    categories: config.subCategories.map(sub => sub.displayName),
    id: config.id
  }))
];

// 상품 필터링용 - "모든 상품 보기" 제외
export const getProductCategories = (): CategoryGroupForUI[] =>
  CATEGORY_CONFIG.map(config => ({
    title: config.displayName,
    categories: config.subCategories.map(sub => sub.displayName),
    id: config.id
  }));

// URL과 InhaleType ID 매핑 함수들
export const mapUrlToInhaleTypeIds = (urlValues: string[] | null): string[] => {
  if (!urlValues || !Array.isArray(urlValues)) {
    return [];
  }
  return urlValues.map(urlValue => {
    const config = INHALE_TYPE_CONFIG.find(c => c.name === urlValue);
    return config ? config.name : urlValue;
  });
};

export const mapInhaleTypeIdToUrl = (inhaleTypeIds: string[] | null): string[] => {
  if (!inhaleTypeIds || !Array.isArray(inhaleTypeIds)) {
    return [];
  }
  return inhaleTypeIds.map(id => {
    const config = INHALE_TYPE_CONFIG.find(c => c.name === id);
    return config ? config.name : id;
  });
};