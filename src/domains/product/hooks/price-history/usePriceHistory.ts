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
  selectedMonth,
  selectedWeekStart
}: UsePriceHistoryOptions) => {
  

  // 데이터 필터링 및 정렬
  const filteredHistory = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return [];

    let filtered = priceHistory.slice();

    if (viewMode === 'monthly') {
      // 월별 뷰: API에서 받은 데이터가 이미 해당 월의 데이터이므로 추가 필터링 불필요
      // 단, 현재 달의 경우 RPC로 받은 데이터일 수 있으므로 월 필터링 적용
      const year = Math.floor(selectedMonth / 12);
      const month = selectedMonth % 12;

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === year && itemDate.getMonth() === month;
      });
    } else {
      // 일별 뷰: 선택된 주의 데이터 (월~일 7일간)
      const weekStart = new Date(selectedWeekStart);
      const weekEnd = new Date(selectedWeekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // 6일 후 (7일간)
      weekEnd.setHours(23, 59, 59, 999); // 해당 일의 마지막 시간

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= weekStart && itemDate <= weekEnd;
      });
    }

    // 날짜순 정렬
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [priceHistory, viewMode, selectedMonth, selectedWeekStart]);

  return {
    filteredHistory
  };
};