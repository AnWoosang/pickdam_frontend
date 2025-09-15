"use client";

import { useMemo } from 'react';
import type { LowestPriceHistory } from '@/domains/product/types/product';

type ViewMode = 'daily' | 'monthly';

interface UsePriceHistoryOptions {
  priceHistory: LowestPriceHistory[];
  viewMode: ViewMode;
  selectedMonth: number;
  selectedWeekStart: Date;
}

export const usePriceHistory = ({
  priceHistory,
  viewMode,
  selectedMonth: _selectedMonth,
  selectedWeekStart
}: UsePriceHistoryOptions) => {
  

  // 데이터 필터링 및 정렬
  const filteredHistory = useMemo(() => {
    let filtered = priceHistory.slice();
    
    if (viewMode === 'monthly') {
      // 월별 뷰: 최근 1년 데이터
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      filtered = filtered.filter(item => new Date(item.date) >= oneYearAgo);
    } else {
      // 일별 뷰: 선택된 주의 데이터
      const weekStart = new Date(selectedWeekStart);
      const weekEnd = new Date(selectedWeekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= weekStart && itemDate < weekEnd;
      });
    }
    
    // 날짜순 정렬
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [priceHistory, viewMode, selectedWeekStart]);

  return {
    filteredHistory
  };
};