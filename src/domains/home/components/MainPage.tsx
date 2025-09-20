"use client";

import { useEffect } from 'react';
import { ProductSlider } from '@/domains/home/components/ProductSlider';
import { PromoBanner } from '@/domains/home/components/PromoBanner';
import { Container } from '@/shared/layout/Container';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { useHomePage } from '@/domains/home/hooks/useHomePage';
import { perf } from '@/shared/utils/performance';

export function MainPage() {
  // 성능 추적 시작
  useEffect(() => {
    perf.start('MainPage-Mount');
    return () => perf.end('MainPage-Mount');
  }, []);

  const { bestSellers, popularProducts, isLoading, hasError, errorMessage, onRetry } = useHomePage();

  // 로딩 상태
  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  // 에러 상태
  if (hasError) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-96">
          <ErrorMessage 
            message={errorMessage || "홈 데이터를 불러오는데 실패했습니다."}
            onRetry={onRetry}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-8 py-10">
        {/* 홍보 배너 섹션 */}
        <PromoBanner />

        {/* 베스트 셀러 섹션 */}
        <div>
          <ProductSlider
            title="🔥 꾸준히 사랑받는 베스트 셀러에요"
            products={bestSellers}
            showNavigationButtons={true}
            autoPlay={false}
          />
        </div>

        {/* 최근 인기 상품 섹션 */}
        <div>
          <ProductSlider
            title="🔥 최근 인기있는 상품들을 모아봤어요"
            products={popularProducts}
            showNavigationButtons={true}
            autoPlay={false}
          />
        </div>

      </div>
    </Container>
  );
}