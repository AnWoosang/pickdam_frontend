import { CATEGORY_CONFIG, MainCategory } from '@/types/product';

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

// 메인 네비게이션 메뉴
export const mainNavItems = [
  { label: '커뮤니티', href: '/community' },
  { label: '나에게 맞는 액상찾기', href: '/liquid-finder' },
  { label: '이벤트', href: '/events' },
] as const;