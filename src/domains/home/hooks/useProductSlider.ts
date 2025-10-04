"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/domains/product/types/product';
import { ROUTES } from '@/app/router/routes';

// 슬라이더 설정 상수
const SLIDER_DEFAULTS = {
  CARD_COUNT: 4,
  VISIBLE_CARD_COUNT: 4.5,
  MOBILE_CARD_COUNT: 2,
  MOBILE_VISIBLE_CARD_COUNT: 2,
  AUTO_PLAY_INTERVAL: 4000,
} as const;

interface UseProductSliderProps {
  products: Product[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  cardCount?: number;
  visibleCardCount?: number;
}

/**
 * 상품 슬라이더 비즈니스 로직 훅
 */
export const useProductSlider = ({
  products,
  autoPlay = false,
  autoPlayInterval = SLIDER_DEFAULTS.AUTO_PLAY_INTERVAL,
  cardCount = SLIDER_DEFAULTS.CARD_COUNT,
  visibleCardCount = SLIDER_DEFAULTS.VISIBLE_CARD_COUNT,
}: UseProductSliderProps) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const finalCardCount = isMobile ? SLIDER_DEFAULTS.MOBILE_CARD_COUNT : cardCount;
  const finalVisibleCardCount = isMobile ? SLIDER_DEFAULTS.MOBILE_VISIBLE_CARD_COUNT : visibleCardCount;
  const maxIndex = Math.max(0, products.length - finalCardCount);

  // 자동 재생 효과
  useEffect(() => {
    if (autoPlay && products.length > finalCardCount) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoPlay, autoPlayInterval, finalCardCount, maxIndex, products.length]);

  // 이전 슬라이드로 이동
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // 다음 슬라이드로 이동
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // 상품 클릭 핸들러
  const handleProductClick = useCallback((product: Product) => {
    router.push(ROUTES.PRODUCT.DETAIL(product.id));
  }, [router]);

  // 슬라이더 표시 여부
  const shouldShowSlider = products.length > 0;
  const shouldShowNavigation = products.length > finalCardCount;

  return {
    // 상태
    currentIndex,
    maxIndex,
    shouldShowSlider,
    shouldShowNavigation,

    // 설정값
    cardCount: finalCardCount,
    visibleCardCount: finalVisibleCardCount,

    // 액션
    goToPrevious,
    goToNext,
    handleProductClick,
  };
};