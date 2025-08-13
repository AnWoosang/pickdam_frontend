import { ProductPreview, RecentSearch, TrendingKeyword, RecommendedKeyword } from '@/types/search';
import { ProductCategory } from '@/types/product';

// Mock 상품 미리보기 데이터
export const mockSearchProducts: ProductPreview[] = [
  {
    id: 'p7',
    name: '부드러운 오렌지 팟',
    price: 26341,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=오렌지팟',
    productCategory: ProductCategory.DEVICE,
    inhaleType: 'DTL',
    flavor: '무향',
    capacity: '100ml',
    brand: 'MYLE',
    totalViews: 1245,
    totalFavorites: 92,
  },
  {
    id: 'p8',
    name: '고급형 라임 팟',
    price: 20824,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=라임팟',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '딸기',
    capacity: '30ml',
    brand: 'RELX',
    totalViews: 828,
    totalFavorites: 93,
  },
  {
    id: 'p9',
    name: '클래식 블랙 아이스 액상',
    price: 28696,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=블랙아이스',
    productCategory: ProductCategory.DEVICE,
    inhaleType: 'DTL',
    flavor: '복숭아',
    capacity: '60ml',
    brand: 'MYLE',
    totalViews: 508,
    totalFavorites: 89,
  },
  {
    id: 'p10',
    name: '강력한 멘솔 디바이스',
    price: 17268,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=멘솔',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '멘솔',
    capacity: '30ml',
    brand: 'JUUL',
    totalViews: 377,
    totalFavorites: 12,
  },
  {
    id: 'p11',
    name: '달달한 오렌지 쥴',
    price: 44652,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=오렌지쥴',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '딸기',
    capacity: '30ml',
    brand: 'RELX',
    totalViews: 1580,
    totalFavorites: 66,
  },
  {
    id: 'p12',
    name: '쿨링 사과 팟',
    price: 26362,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=사과팟',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '블랙 아이스',
    capacity: '30ml',
    brand: 'JUUL',
    totalViews: 1112,
    totalFavorites: 77,
  },
  {
    id: 'p13',
    name: '시원한 오렌지 쥴',
    price: 37369,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=시원한오렌지',
    productCategory: ProductCategory.DEVICE,
    inhaleType: 'DTL',
    flavor: '무향',
    capacity: '100ml',
    brand: 'MYLE',
    totalViews: 456,
    totalFavorites: 46,
  },
  {
    id: 'p14',
    name: '클래식 코코넛 쥴',
    price: 13522,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=코코넛',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '레몬 민트',
    capacity: '30ml',
    brand: 'RELX',
    totalViews: 1073,
    totalFavorites: 34,
  },
  {
    id: 'p15',
    name: '클래식 사과 디바이스',
    price: 46359,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=사과디바이스',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '멘솔',
    capacity: '30ml',
    brand: 'JUUL',
    totalViews: 874,
    totalFavorites: 17,
  },
  {
    id: 'p16',
    name: '고급형 멘솔 팟',
    price: 17563,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=멘솔팟',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '딸기',
    capacity: '30ml',
    brand: 'RELX',
    totalViews: 1088,
    totalFavorites: 56,
  },
  {
    id: 'p17',
    name: '고급형 오렌지 팟',
    price: 19271,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=고급오렌지',
    productCategory: ProductCategory.DEVICE,
    inhaleType: 'DTL',
    flavor: '무향',
    capacity: '100ml',
    brand: 'MYLE',
    totalViews: 1627,
    totalFavorites: 25,
  },
  {
    id: 'p18',
    name: '달달한 라임 액상',
    price: 14651,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=라임액상',
    productCategory: ProductCategory.DEVICE,
    inhaleType: 'DTL',
    flavor: '무향',
    capacity: '100ml',
    brand: 'MYLE',
    totalViews: 303,
    totalFavorites: 67,
  },
  {
    id: 'p19',
    name: '상큼한 멘솔 기기',
    price: 42721,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=상큼멘솔',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '딸기',
    capacity: '30ml',
    brand: 'RELX',
    totalViews: 1413,
    totalFavorites: 77,
  },
  {
    id: 'p20',
    name: '달달한 멘솔 기기',
    price: 16882,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=달달멘솔',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '블랙 아이스',
    capacity: '30ml',
    brand: 'JUUL',
    totalViews: 1973,
    totalFavorites: 37,
  },
  {
    id: 'p21',
    name: '고급형 사과 기기',
    price: 38552,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=고급사과',
    productCategory: ProductCategory.DEVICE,
    inhaleType: 'DTL',
    flavor: '무향',
    capacity: '100ml',
    brand: 'MYLE',
    totalViews: 785,
    totalFavorites: 28,
  },
  {
    id: 'p22',
    name: '쿨링 무향 전자 기기',
    price: 24759,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=쿨링무향',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '레몬 민트',
    capacity: '30ml',
    brand: 'RELX',
    totalViews: 1008,
    totalFavorites: 54,
  },
  {
    id: 'p23',
    name: '고급형 멘솔 기기',
    price: 16129,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=고급멘솔',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '딸기',
    capacity: '30ml',
    brand: 'RELX',
    totalViews: 1160,
    totalFavorites: 62,
  },
  {
    id: 'p24',
    name: '프레쉬 멘솔 전자 기기',
    price: 24939,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=프레쉬멘솔',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '레몬 민트',
    capacity: '30ml',
    brand: 'RELX',
    totalViews: 467,
    totalFavorites: 51,
  },
  {
    id: 'p25',
    name: '달달한 코코넛 디바이스',
    price: 32888,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=달달코코넛',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '레몬 민트',
    capacity: '30ml',
    brand: 'RELX',
    totalViews: 906,
    totalFavorites: 85,
  },
  {
    id: 'p26',
    name: '부드러운 블랙 아이스 기기',
    price: 16746,
    imageUrl: 'https://via.placeholder.com/150x150.png?text=부드러운블랙',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '레몬 민트',
    capacity: '30ml',
    brand: 'RELX',
    totalViews: 1299,
    totalFavorites: 18,
  },
];

// 최근 검색어 Mock 데이터
export const mockRecentSearches: RecentSearch[] = [
  {
    id: 'rs1',
    keyword: '멘솔',
    searchedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10분 전
  },
  {
    id: 'rs2',
    keyword: '딸기',
    searchedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
  },
  {
    id: 'rs3',
    keyword: 'JUUL',
    searchedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
  },
  {
    id: 'rs4',
    keyword: '블랙 아이스',
    searchedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5시간 전
  },
  {
    id: 'rs5',
    keyword: '레몬 민트',
    searchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
  },
];

// 인기 키워드 Mock 데이터
export const mockTrendingKeywords: TrendingKeyword[] = [
  {
    id: 'tk1',
    keyword: '멘솔',
    rank: 1,
    changeStatus: 'same',
    searchCount: 2547,
  },
  {
    id: 'tk2',
    keyword: '딸기',
    rank: 2,
    changeStatus: 'up',
    searchCount: 1923,
  },
  {
    id: 'tk3',
    keyword: 'JUUL',
    rank: 3,
    changeStatus: 'down',
    searchCount: 1456,
  },
  {
    id: 'tk4',
    keyword: '블랙 아이스',
    rank: 4,
    changeStatus: 'up',
    searchCount: 1234,
  },
  {
    id: 'tk5',
    keyword: 'MYLE',
    rank: 5,
    changeStatus: 'new',
    searchCount: 987,
  },
  {
    id: 'tk6',
    keyword: '레몬 민트',
    rank: 6,
    changeStatus: 'same',
    searchCount: 845,
  },
  {
    id: 'tk7',
    keyword: 'RELX',
    rank: 7,
    changeStatus: 'up',
    searchCount: 723,
  },
  {
    id: 'tk8',
    keyword: '코코넛',
    rank: 8,
    changeStatus: 'down',
    searchCount: 612,
  },
  {
    id: 'tk9',
    keyword: '사과',
    rank: 9,
    changeStatus: 'same',
    searchCount: 534,
  },
  {
    id: 'tk10',
    keyword: '오렌지',
    rank: 10,
    changeStatus: 'down',
    searchCount: 456,
  },
];

// 추천 키워드 Mock 데이터
export const mockRecommendedKeywords: RecommendedKeyword[] = [
  {
    id: 'rk1',
    keyword: '군침싹 수박바',
    category: '과일',
    popularity: 95,
  },
  {
    id: 'rk2',
    keyword: '피오부아',
    category: '브랜드',
    popularity: 88,
  },
  {
    id: 'rk3',
    keyword: '999',
    category: '브랜드',
    popularity: 82,
  },
  {
    id: 'rk4',
    keyword: '연초맛',
    category: '맛',
    popularity: 76,
  },
  {
    id: 'rk5',
    keyword: '입호흡',
    category: '방식',
    popularity: 71,
  },
  {
    id: 'rk6',
    keyword: '폐호흡',
    category: '방식',
    popularity: 68,
  },
];

// 브랜드 목록
export const availableBrands = ['JUUL', 'RELX', 'MYLE', '999', '피오부아', 'OM.G', '매드클라우드'];

// 호흡 방식 목록
export const availableInhaleTypes = ['MTL', 'DTL'];

// 카테고리 목록 (ProductCategory enum과 매핑)
export const availableCategories = [
  { value: ProductCategory.LIQUID, label: '액상' },
  { value: ProductCategory.DEVICE, label: '기기' },
  { value: ProductCategory.POD, label: '팟' },
  { value: ProductCategory.COIL, label: '코일' },
  { value: ProductCategory.ACCESSORY, label: '액세서리' },
];

// 검색 자동완성을 위한 함수
export const getSearchSuggestions = (query: string) => {
  
  // 상품명 검색
  const productMatches = mockSearchProducts
    .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3)
    .map(product => ({
      type: 'product' as const,
      value: product.name,
      label: product.name,
      count: 1,
    }));
  
  // 브랜드 검색
  const brandMatches = availableBrands
    .filter(brand => brand.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 2)
    .map(brand => ({
      type: 'brand' as const,
      value: brand,
      label: `브랜드: ${brand}`,
      count: mockSearchProducts.filter(p => p.brand === brand).length,
    }));

  // 키워드 검색
  const keywordMatches = [...mockTrendingKeywords, ...mockRecommendedKeywords]
    .filter(item => item.keyword.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 2)
    .map(item => ({
      type: 'keyword' as const,
      value: item.keyword,
      label: item.keyword,
      count: 'searchCount' in item ? item.searchCount : item.popularity,
    }));

  return [...productMatches, ...brandMatches, ...keywordMatches];
};