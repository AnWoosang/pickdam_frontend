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

export const useChartData = ({
  filteredHistory,
  viewMode: _viewMode
}: UseChartDataOptions) => {
  
  const chartData = useMemo((): ChartData[] => {
    return filteredHistory.map(item => ({
      date: item.date,
      displayDate: new Date(item.date).toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric' 
      }),
      fullDate: new Date(item.date).toLocaleDateString('ko-KR', { 
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      }),
      price: item.price,
      originalDate: item.date
    }));
  }, [filteredHistory]);

  return {
    chartData
  };
};