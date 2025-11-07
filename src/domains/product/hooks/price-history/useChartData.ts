"use client";

import { useMemo } from 'react';
import { LowestPriceHistory } from '@/domains/product/types/product';

interface ChartData {
  date: string;
  displayDate: string;
  fullDate: string;
  price: number;
  originalDate: string;
}

interface UseChartDataOptions {
  filteredHistory: LowestPriceHistory[];
  viewMode: 'daily' | 'monthly';
}

/**
 * Date 객체를 로컬 timezone 기준 ISO 문자열로 변환
 * 예: 2025-11-07 00:00:00 (KST) → "2025-11-07"
 */
function toLocalISOString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useChartData = ({
  filteredHistory,
  viewMode: _viewMode
}: UseChartDataOptions) => {

  const chartData = useMemo((): ChartData[] => {
    return filteredHistory.map(item => {
      const localDateString = toLocalISOString(item.date);

      return {
        date: localDateString,
        displayDate: item.date.toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric'
        }),
        fullDate: item.date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        price: item.price,
        originalDate: localDateString
      };
    });
  }, [filteredHistory]);

  return {
    chartData
  };
};