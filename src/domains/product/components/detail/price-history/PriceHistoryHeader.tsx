import React, { useMemo } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { LowestPriceHistory } from '@/domains/product/types/product';
import { formatPrice } from '@/shared/utils/Format';

interface PriceChangeInfo {
  amount: number;
  percent: string;
  isIncrease: boolean;
}

interface PriceHistoryHeaderProps {
  filteredHistory: LowestPriceHistory[];
  viewMode: 'daily' | 'monthly';
}

export function PriceHistoryHeader({ 
  filteredHistory, 
  viewMode
}: PriceHistoryHeaderProps) {
  // 가격 변동률 계산
  const priceChange = useMemo((): PriceChangeInfo | null => {
    if (filteredHistory.length < 2) return null;
    
    const oldPrice = filteredHistory[0].price;
    const currentPrice = filteredHistory[filteredHistory.length - 1].price;
    const change = currentPrice - oldPrice;
    const changePercent = ((change / oldPrice) * 100).toFixed(1);
    
    return {
      amount: change,
      percent: changePercent,
      isIncrease: change > 0
    };
  }, [filteredHistory]);
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900">가격 변동 이력</h3>
      <div className="flex items-center space-x-4 mt-1 h-6">
        {priceChange && (
          <div className={`flex items-center space-x-2 text-sm ${
            priceChange.isIncrease ? 'text-red-500' : 'text-green-500'
          }`}>
            {priceChange.isIncrease ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{formatPrice(Math.abs(priceChange.amount))}원</span>
            <span>({priceChange.isIncrease ? '+' : ''}{priceChange.percent}%)</span>
          </div>
        )}
        {viewMode === 'monthly' && (
          <p className="text-xs text-gray-500">최대 1년까지의 데이터를 제공합니다</p>
        )}
      </div>
    </div>
  );
}