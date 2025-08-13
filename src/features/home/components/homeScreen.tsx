"use client";

import { useState } from 'react';
import { Product, ProductCategory } from '@/types/product';
import { ProductSlider } from './productSlider';
import { KeywordTrend } from './keywordTrend';
import { BrandSection } from './brandSection';
import { PromoBanner } from './promoBanner';
import { Container } from '@/components/layout/container';


// Mock 데이터 - 베스트셀러 상품들 (15개)
const mockBestSellerProducts: Product[] = [
  {
    id: 'bs1',
    name: '갈아먹구싶오',
    price: 25000,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%236b7280"%3E갈아먹구싶오%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '과일맛',
    capacity: '10ml',
    totalViews: 1250,
    totalFavorites: 45,
  },
  {
    id: 'bs2',
    name: '군침싹 수박바',
    price: 28000,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23e0f2fe"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%2301579b"%3E수박바%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '수박',
    capacity: '30ml',
    totalViews: 2100,
    totalFavorites: 78,
  },
  {
    id: 'bs3',
    name: '피오부아 민트',
    price: 35000,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23d1fae5"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23065f46"%3E피오부아%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'DL',
    flavor: '멘솔',
    capacity: '15ml',
    totalViews: 980,
    totalFavorites: 32,
  },
  {
    id: 'bs4',
    name: '클래식 담배맛',
    price: 27500,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fef7cd"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23854d0e"%3E담배맛%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '담배',
    capacity: '30ml',
    totalViews: 1800,
    totalFavorites: 65,
  },
  {
    id: 'bs5',
    name: '레몬 아이스팟',
    price: 31000,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fef3c7"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23d97706"%3E레몬%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'DL',
    flavor: '레몬',
    capacity: '30ml',
    totalViews: 1350,
    totalFavorites: 42,
  },
  {
    id: 'bs6',
    name: '딸기쉐이크',
    price: 29500,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fce7f3"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23be185d"%3E딸기%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '딸기',
    capacity: '30ml',
    totalViews: 1120,
    totalFavorites: 38,
  },
  {
    id: 'bs7',
    name: '블루베리 쿨링',
    price: 32500,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23dbeafe"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%231d4ed8"%3E블루베리%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'RDL',
    flavor: '블루베리',
    capacity: '30ml',
    totalViews: 1690,
    totalFavorites: 58,
  },
  {
    id: 'bs8',
    name: '망고 타이풍',
    price: 33000,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fed7aa"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23c2410c"%3E망고%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'DL',
    flavor: '망고',
    capacity: '60ml',
    totalViews: 1420,
    totalFavorites: 49,
  },
  {
    id: 'bs9',
    name: '바닐라 커스터드',
    price: 26800,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f7fafc"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%234a5568"%3E바닐라%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '바닐라',
    capacity: '30ml',
    totalViews: 1080,
    totalFavorites: 35,
  },
  {
    id: 'bs10',
    name: '체리 콜라',
    price: 29900,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fee2e2"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23dc2626"%3E체리콜라%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'DL',
    flavor: '체리콜라',
    capacity: '60ml',
    totalViews: 1560,
    totalFavorites: 52,
  },
  {
    id: 'bs11',
    name: '애플 아이스',
    price: 28500,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f0fdf4"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23166534"%3E애플%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '애플',
    capacity: '30ml',
    totalViews: 1320,
    totalFavorites: 44,
  },
  {
    id: 'bs12',
    name: '오렌지 쥬스',
    price: 27200,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fff7ed"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23ea580c"%3E오렌지%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'RDL',
    flavor: '오렌지',
    capacity: '30ml',
    totalViews: 1150,
    totalFavorites: 39,
  },
  {
    id: 'bs13',
    name: '코코넛 밀크',
    price: 31500,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fefce8"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23a16207"%3E코코넛%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'DL',
    flavor: '코코넛',
    capacity: '60ml',
    totalViews: 980,
    totalFavorites: 28,
  },
  {
    id: 'bs14',
    name: '라즈베리 타르트',
    price: 34500,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fdf2f8"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23be185d"%3E라즈베리%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '라즈베리',
    capacity: '30ml',
    totalViews: 1740,
    totalFavorites: 61,
  },
  {
    id: 'bs15',
    name: '카페 라떼',
    price: 30000,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f5f5dc"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%236b4423"%3E카페라떼%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'RDL',
    flavor: '커피',
    capacity: '30ml',
    totalViews: 1460,
    totalFavorites: 47,
  }
];

// Mock 데이터 - 최근 인기 상품들 (15개)
const mockPopularProducts: Product[] = [
  {
    id: 'pp1',
    name: '민트 블라스트',
    price: 32000,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23d1fae5"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23065f46"%3E민트%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'DL',
    flavor: '민트',
    capacity: '60ml',
    totalViews: 850,
    totalFavorites: 28,
  },
  {
    id: 'pp2',
    name: '바닐라 크림',
    price: 26500,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f7fafc"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%236b7280"%3E바닐라%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '바닐라',
    capacity: '30ml',
    totalViews: 1200,
    totalFavorites: 52,
  },
  {
    id: 'pp3',
    name: '트로피컬 믹스',
    price: 30000,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fed7aa"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23c2410c"%3E트로피컬%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'DL',
    flavor: '열대과일',
    capacity: '60ml',
    totalViews: 920,
    totalFavorites: 35,
  },
  {
    id: 'pp4',
    name: '청포도 아이스',
    price: 28500,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f0f9ff"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%230369a1"%3E청포도%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '청포도',
    capacity: '30ml',
    totalViews: 1050,
    totalFavorites: 41,
  },
  {
    id: 'pp5',
    name: '콜라 플레이버',
    price: 27000,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f7fafc"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23374151"%3E콜라%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'DL',
    flavor: '콜라',
    capacity: '60ml',
    totalViews: 780,
    totalFavorites: 26,
  },
  {
    id: 'pp6',
    name: '스트로베리 밀크',
    price: 29200,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fce7f3"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23be185d"%3E딸기밀크%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'RDL',
    flavor: '딸기밀크',
    capacity: '30ml',
    totalViews: 1380,
    totalFavorites: 46,
  },
  {
    id: 'pp7',
    name: '키위 스무디',
    price: 31800,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f0fdf4"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23166534"%3E키위%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '키위',
    capacity: '30ml',
    totalViews: 950,
    totalFavorites: 31,
  },
  {
    id: 'pp8',
    name: '피치 아이스티',
    price: 28800,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fed7aa"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23c2410c"%3E피치%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'DL',
    flavor: '복숭아',
    capacity: '60ml',
    totalViews: 1120,
    totalFavorites: 37,
  },
  {
    id: 'pp9',
    name: '초콜릿 브라우니',
    price: 33500,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23d2b48c"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%234a4a4a"%3E초콜릿%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '초콜릿',
    capacity: '30ml',
    totalViews: 890,
    totalFavorites: 29,
  },
  {
    id: 'pp10',
    name: '라임 모히또',
    price: 30500,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23d1fae5"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23065f46"%3E라임%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'RDL',
    flavor: '라임',
    capacity: '60ml',
    totalViews: 1270,
    totalFavorites: 43,
  },
  {
    id: 'pp11',
    name: '머스크멜론',
    price: 27900,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fef3c7"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23d97706"%3E멜론%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '멜론',
    capacity: '30ml',
    totalViews: 1040,
    totalFavorites: 34,
  },
  {
    id: 'pp12',
    name: '그린애플 버블',
    price: 32200,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f0fdf4"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23166534"%3E그린애플%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'DL',
    flavor: '그린애플',
    capacity: '60ml',
    totalViews: 1190,
    totalFavorites: 40,
  },
  {
    id: 'pp13',
    name: '허니듀 메론',
    price: 29700,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fef7cd"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23ca8a04"%3E허니듀%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'MTL',
    flavor: '허니듀',
    capacity: '30ml',
    totalViews: 870,
    totalFavorites: 28,
  },
  {
    id: 'pp14',
    name: '패션후르츠 쿨러',
    price: 34200,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23fbbf24"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23fff"%3E패션후르츠%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'DL',
    flavor: '패션후르츠',
    capacity: '60ml',
    totalViews: 1520,
    totalFavorites: 51,
  },
  {
    id: 'pp15',
    name: '아이스크림 바닐라',
    price: 28300,
    imageUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f8fafc"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%234a5568"%3E아이스크림%3C/text%3E%3C/svg%3E',
    productCategory: ProductCategory.LIQUID,
    inhaleType: 'RDL',
    flavor: '아이스크림',
    capacity: '30ml',
    totalViews: 1100,
    totalFavorites: 36,
  }
];

const popularKeywords = [
  '갈아먹구싶오', '군침싹 수박바', '멘솔', '연초맛', '피오부아', '디바이스 베이프',
];

const popularBrands = [
  '월드베이프', '닥터베이프', '피오부아', '999', 'OM.G', '매드클라우드', '레드베어'
];

export function HomeScreen() {
  const [bestSellerProducts] = useState<Product[]>(mockBestSellerProducts);
  const [recentPopularProducts] = useState<Product[]>(mockPopularProducts);

  return (
    <Container>
      <div className="space-y-8 py-10">
        {/* 홍보 배너 섹션 */}
        <PromoBanner />

        {/* 베스트 셀러 섹션 */}
        <div>
          <ProductSlider
            title="🔥 꾸준히 사랑받는 베스트 셀러에요"
            products={bestSellerProducts}
            showNavigationButtons={true}
            autoPlay={false}
          />
        </div>

        {/* 최근 인기 상품 섹션 */}
        <div>
          <ProductSlider
            title="🔥 최근 인기있는 상품들을 모아봤어요"
            products={recentPopularProducts}
            showNavigationButtons={true}
            autoPlay={false}
          />
        </div>

        {/* 키워드 트렌드 섹션 */}
        <KeywordTrend popularKeywords={popularKeywords} />

        {/* 브랜드 섹션 */}
        <BrandSection brands={popularBrands} />

        {/* 구분선 */}
        <hr className="border-grayLight" />

        {/* 광고 배너 섹션 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[728/90] max-w-[728px] bg-grayBackground border border-grayLight rounded-lg overflow-hidden mx-auto flex items-center justify-center">
            <span className="text-hintText text-sm">광고 배너 1</span>
          </div>
          <div className="aspect-[728/90] max-w-[728px] bg-grayBackground border border-grayLight rounded-lg overflow-hidden mx-auto flex items-center justify-center">
            <span className="text-hintText text-sm">광고 배너 2</span>
          </div>
        </div>
      </div>
    </Container>
  );
}