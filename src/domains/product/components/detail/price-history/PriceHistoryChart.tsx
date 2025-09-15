'use client';

import React, { useState } from 'react';
import { LowestPriceHistory } from '@/domains/product/types/product';
import { PriceHistoryHeader } from './PriceHistoryHeader';
import { PriceHistoryControls } from './PriceHistoryControls';
import { PriceHistoryChartView } from './PriceHistoryChartView';
import { PriceHistorySummary } from './PriceHistorySummary';
import { usePriceHistory } from '@/domains/product/hooks/price-history/usePriceHistory';

type ViewMode = 'daily' | 'monthly';

interface PriceHistoryChartProps {
  priceHistory: LowestPriceHistory[];
  className?: string;
}

export function PriceHistoryChart({ 
  priceHistory, 
  className = '' 
}: PriceHistoryChartProps) {
  // Controls 컴포넌트에서 관리되는 상태들
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  });
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return startOfWeek;
  });

  // 비즈니스 로직 훅 사용 (필터링된 데이터만)
  const {
    filteredHistory
  } = usePriceHistory({
    priceHistory,
    viewMode,
    selectedMonth,
    selectedWeekStart
  });

  // Controls에서 상태 변경을 받는 핸들러
  const handleViewModeChange = (newViewMode: ViewMode, newSelectedMonth: number, newSelectedWeekStart: Date) => {
    setViewMode(newViewMode);
    setSelectedMonth(newSelectedMonth);
    setSelectedWeekStart(newSelectedWeekStart);
  };


  // 데이터가 없는 경우 처리
  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">가격 변동 이력</h3>
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">가격 변동 이력이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* 헤더와 뷰 모드 토글 */}
      <div className="flex items-center justify-between mb-6">
        <PriceHistoryHeader 
          filteredHistory={filteredHistory}
          viewMode={viewMode}
        />
        
        <PriceHistoryControls
          priceHistory={priceHistory}
          onViewModeChange={handleViewModeChange}
        />
      </div>

      {/* 차트 */}
      <div className="h-80 w-full">
        <PriceHistoryChartView
          filteredHistory={filteredHistory}
          viewMode={viewMode}
        />
      </div>

      {/* 요약 정보 */}
      <PriceHistorySummary
        filteredHistory={filteredHistory}
        viewMode={viewMode}
      />
    </div>
  );
}