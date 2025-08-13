"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/productCard';
import { RoutePaths } from '@/constants/routes';

interface ProductSliderProps {
  title: string;
  products: Product[];
  showNavigationButtons?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function ProductSlider({
  title,
  products,
  showNavigationButtons = false,
  autoPlay = false,
  autoPlayInterval = 4000,
}: ProductSliderProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 데스크톱 고정 4개 카드 + 0.5개 미리보기
  const cardCount = 4;
  const visibleCardCount = 4.5; // 4개 완전히 + 0.5개 미리보기
  const maxIndex = Math.max(0, products.length - cardCount);

  // 자동 재생 효과
  useEffect(() => {
    if (autoPlay && products.length > cardCount) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoPlay, autoPlayInterval, cardCount, maxIndex, products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev <= 0 ? maxIndex : prev - 1;
      console.log('Previous clicked - Current:', prev, 'New:', newIndex, 'Max:', maxIndex);
      return newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev >= maxIndex ? 0 : prev + 1;
      console.log('Next clicked - Current:', prev, 'New:', newIndex, 'Max:', maxIndex);
      return newIndex;
    });
  };

  const handleProductClick = (product: Product) => {
    router.push(RoutePaths.productDetail(product.id));
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* 제목 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-textHeading">
            {title}
          </h2>
          {products.length > cardCount && (
            <p className="text-sm text-hintText mt-2">
              총 {products.length}개 상품
            </p>
          )}
        </div>
      </div>

      {/* 상품 슬라이더 with 양옆 버튼 */}
      <div className="relative">
        {/* 왼쪽 화살표 버튼 */}
        {showNavigationButtons && products.length > cardCount && (
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 z-10 p-2 rounded-full bg-white border border-grayLight shadow-md hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
            aria-label="이전 상품"
          >
            <ChevronLeft className="w-5 h-5 text-grayDark" />
          </button>
        )}

        {/* 오른쪽 화살표 버튼 */}
        {showNavigationButtons && products.length > cardCount && (
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 z-10 p-2 rounded-full bg-white border border-grayLight shadow-md hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
            aria-label="다음 상품"
          >
            <ChevronRight className="w-5 h-5 text-grayDark" />
          </button>
        )}

        {/* 상품 슬라이더 - 다음 카드 미리보기 */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCardCount)}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0"
                style={{ 
                  width: `${100 / visibleCardCount}%`
                }}
              >
                <div className="px-2">
                  <ProductCard 
                    product={product} 
                    onClick={() => handleProductClick(product)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

