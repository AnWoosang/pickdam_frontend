import React, { useMemo } from 'react';
import { LowestPriceHistory } from '@/domains/product/types/product';
import { formatPrice } from '@/shared/utils/Format';

interface PriceHistorySummaryProps {
  filteredHistory: LowestPriceHistory[];
  viewMode: 'daily' | 'monthly';
}

export function PriceHistorySummary({ 
  filteredHistory, 
  viewMode
}: PriceHistorySummaryProps) {
  // 가격 통계 계산
  const priceStats = useMemo(() => {
    if (filteredHistory.length === 0) return null;
    
    const prices = filteredHistory.map(item => item.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const currentPrice = filteredHistory[filteredHistory.length - 1]?.price || 0;
    const isCurrentPriceMax = currentPrice === maxPrice;
    
    return {
      maxPrice,
      minPrice,
      currentPrice,
      isCurrentPriceMax
    };
  }, [filteredHistory]);
  
  if (!priceStats) {
    return null;
  }
  
  const { maxPrice, minPrice, currentPrice, isCurrentPriceMax } = priceStats;

  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-600">최고가</div>
          <div className="text-lg font-bold text-black-500">
            {formatPrice(maxPrice)}원
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">최저가</div>
          <div className="text-lg font-bold text-black">
            {formatPrice(minPrice)}원
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">현재가</div>
          <div className="text-lg font-bold text-black">
            {formatPrice(currentPrice)}원
          </div>
        </div>
      </div>

      {/* 가격 차이 설명 */}
      <div className={`rounded-lg p-4 text-center ${
        isCurrentPriceMax ? 'bg-red-50' : 'bg-green-50'
      }`}>
        <div className={`text-lg font-bold ${
          isCurrentPriceMax ? 'text-red-700' : 'text-green-700'
        }`}>
          {isCurrentPriceMax
            ? `현재 가격이 ${viewMode === 'daily' ? '이번 주' : '이번 달'} 최고가예요`
            : `${viewMode === 'daily' ? '이번 주' : '이번 달'} 최고가 대비 ${formatPrice(maxPrice - currentPrice)}원 더 싼 가격이에요`
          }
        </div>
      </div>
    </div>
  );
}