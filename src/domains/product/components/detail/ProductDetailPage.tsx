'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { useProductDetail } from '../../hooks/useProductDetail';

// 컴포넌트 import
import { ProductImageSection } from './ProductImageSection';
import { PriceHistoryChart } from './price-history/PriceHistoryChart';
import { PriceComparisonSection } from './PriceComparisonSection';
import { ReviewAnalysisSection } from '@/domains/review/components/ReviewAnalysisSection';
import { ReviewListSection } from '@/domains/review/components/ReviewListSection';
import { ReviewWriteSection } from '@/domains/review/components/ReviewWriteSection';

type TabType = 'info' | 'price';

interface ProductDetailPageProps {
  productId: string;
  className?: string;
}

export function ProductDetailPage({
  productId,
  className = ''
}: ProductDetailPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isSticky, setIsSticky] = useState(false);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabBarOffsetTop = useRef<number>(0);

  const {
    product,
    sellers,
    averageReview,
    priceHistory,
    isLoading,
    queryError,
  } = useProductDetail(productId);

  useEffect(() => {
    // 상품 로드 후 탭바의 초기 위치 저장
    if (tabBarRef.current && !isSticky) {
      const rect = tabBarRef.current.getBoundingClientRect();
      tabBarOffsetTop.current = rect.top + window.scrollY;
    }
  }, [product, isSticky]);

  useEffect(() => {
    const handleScroll = () => {
      if (tabBarOffsetTop.current > 0 && window.scrollY >= tabBarOffsetTop.current) {
        setIsSticky(true);
      } else if (window.scrollY < tabBarOffsetTop.current) {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 발생 시
  if (queryError) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <ErrorMessage
          message="상품 정보를 불러오는데 실패했습니다."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // 상품이 없는 경우
  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">상품을 찾을 수 없습니다</h2>
          <button 
            onClick={() => window.history.back()}
            className="text-primary hover:text-primaryDark underline"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 데스크톱: 원래 레이아웃 */}
      <div className="hidden md:block">
        {/* 페이지 제목 */}
        <div className="mt-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            상품 상세보기
          </h1>
        </div>

        {/* 메인 컨텐츠 - 데스크톱 레이아웃 */}
        <div className="grid grid-cols-12 gap-8">
          {/* 좌측 - 상품 이미지 및 통합 정보 */}
          <div className="col-span-5">
            <ProductImageSection product={product} />
          </div>

          {/* 우측 - 가격 변동 이력 및 추가 정보, 가격 비교 */}
          <div className="col-span-7 space-y-6">
            {/* 가격 변동 차트 */}
            <PriceHistoryChart productId={productId} priceHistory={priceHistory} />

            {sellers.length > 0 && <PriceComparisonSection sellers={sellers} />}
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div className="mt-12 space-y-8">
          {averageReview && <ReviewAnalysisSection averageReview={averageReview} />}

          <ReviewListSection productId={product.id} />

          <div className="mb-8">
            <ReviewWriteSection productId={product.id} />
          </div>
        </div>
      </div>

      {/* 모바일: 탭 레이아웃 */}
      <div className="md:hidden">
        {/* Placeholder to prevent layout jump when tab becomes fixed */}
        {isSticky && <div className="h-[57px]" />}

        {/* 탭 헤더 */}
        <div
          ref={tabBarRef}
          className={`${isSticky ? 'fixed top-0 left-0 right-0' : 'mt-4'} z-10 bg-white border-b border-gray-200 mb-4`}
        >
          <div className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${
                activeTab === 'info'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              상품 정보 / 가격 비교
            </button>
            <button
              onClick={() => setActiveTab('price')}
              className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${
                activeTab === 'price'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              가격 변동 / 리뷰
            </button>
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="pb-20">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <ProductImageSection product={product} />
              {sellers.length > 0 && <PriceComparisonSection sellers={sellers} />}
            </div>
          )}

          {activeTab === 'price' && (
            <div className="space-y-4">
              <PriceHistoryChart productId={productId} priceHistory={priceHistory} />
              {averageReview && <ReviewAnalysisSection averageReview={averageReview} />}
              <ReviewListSection productId={product.id} />
              <ReviewWriteSection productId={product.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}