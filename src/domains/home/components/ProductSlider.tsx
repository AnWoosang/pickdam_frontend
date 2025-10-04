"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/domains/product/types/product';
import { ProductCard } from '@/domains/product/components/ProductCard';
import { useProductSlider } from '@/domains/home/hooks/useProductSlider';

interface ProductSliderProps {
  title: string;
  products: Product[];
  showNavigationButtons?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  cardCount?: number;
  visibleCardCount?: number;
}

export function ProductSlider({
  title,
  products,
  showNavigationButtons = false,
  autoPlay = false,
  autoPlayInterval,
  cardCount,
  visibleCardCount,
}: ProductSliderProps) {
  const {
    currentIndex,
    shouldShowSlider,
    shouldShowNavigation,
    cardCount: _finalCardCount,
    visibleCardCount: finalVisibleCardCount,
    goToPrevious,
    goToNext,
    handleProductClick,
  } = useProductSlider({
    products,
    autoPlay,
    autoPlayInterval,
    cardCount,
    visibleCardCount,
  });

  if (!shouldShowSlider) {
    return null;
  }

  return (
    <div className="w-full">
      {/* 제목 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-textHeading">
            {title}
          </h2>
          {shouldShowNavigation && (
            <p className="text-xs md:text-sm text-hintText mt-2">
              총 {products.length}개 상품
            </p>
          )}
        </div>
      </div>

      {/* 상품 슬라이더 with 양옆 버튼 */}
      <div className="relative">
        {/* 왼쪽 화살표 버튼 */}
        {showNavigationButtons && shouldShowNavigation && (
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 z-10 p-2 rounded-full bg-white border border-grayLight shadow-md hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-grayDark" />
          </button>
        )}

        {/* 오른쪽 화살표 버튼 */}
        {showNavigationButtons && shouldShowNavigation && (
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 z-10 p-2 rounded-full bg-white border border-grayLight shadow-md hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-grayDark" />
          </button>
        )}

        {/* 상품 슬라이더 - 다음 카드 미리보기 */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / finalVisibleCardCount)}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0"
                style={{ 
                  width: `${100 / finalVisibleCardCount}%`
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

