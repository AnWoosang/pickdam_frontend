'use client';

import React, { useState, useMemo } from 'react';
import { LowestPriceHistory } from '@/domains/product/types/product';
import { PriceHistoryHeader } from './PriceHistoryHeader';
import { PriceHistoryControls } from './PriceHistoryControls';
import { PriceHistoryChartView } from './PriceHistoryChartView';
import { PriceHistorySummary } from './PriceHistorySummary';
import { usePriceHistory } from '@/domains/product/hooks/price-history/usePriceHistory';
import { useMonthlyPriceHistory } from '@/domains/product/hooks/useProductQueries';

type ViewMode = 'daily' | 'monthly';

interface PriceHistoryChartProps {
  productId: string;
  priceHistory: LowestPriceHistory[];
  className?: string;
}

export function PriceHistoryChart({
  productId,
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
    // 한국식 주 계산: 월요일을 주의 시작일로 설정
    const dayOfWeek = now.getDay(); // 0: 일요일, 1: 월요일...
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 일요일이면 6일 빼기, 그외는 요일-1
    startOfWeek.setDate(now.getDate() - daysToSubtract);
    return startOfWeek;
  });

  // 현재 월 정보 계산
  const currentMonth = useMemo(() => {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  }, []);

  // 선택된 월의 연도와 월 계산
  const selectedYearMonth = useMemo(() => {
    const year = Math.floor(selectedMonth / 12);
    const month = (selectedMonth % 12) + 1; // 1-12월로 변환
    return { year, month };
  }, [selectedMonth]);

  // 다른 월 데이터 조회 (현재 월이 아닌 경우만)
  const isCurrentMonth = selectedMonth === currentMonth;

  // 일뷰에서 다른 달로 이동한 경우 또는 월뷰에서 다른 달인 경우 API 호출 필요
  const needsApiCall = !isCurrentMonth;

  const { data: additionalPriceHistory, isLoading: isLoadingAdditional } = useMonthlyPriceHistory(
    productId,
    selectedYearMonth.year,
    selectedYearMonth.month,
    needsApiCall
  );

  // 사용할 가격 히스토리 데이터 결정
  const activePriceHistory = useMemo(() => {
    if (isCurrentMonth) {
      // 현재 월인 경우 기본 priceHistory 사용
      return priceHistory;
    } else {
      // 다른 월인 경우 추가 조회한 데이터 사용
      return additionalPriceHistory || [];
    }
  }, [isCurrentMonth, priceHistory, additionalPriceHistory]);

  // 비즈니스 로직 훅 사용 (필터링된 데이터만)
  const {
    filteredHistory
  } = usePriceHistory({
    priceHistory: activePriceHistory,
    viewMode,
    selectedMonth,
    selectedWeekStart
  });

  // Controls에서 상태 변경을 받는 핸들러
  const handleViewModeChange = (newViewMode: ViewMode) => {
    setViewMode(newViewMode);
  };

  const handleMonthChange = (newMonth: number) => {
    setSelectedMonth(newMonth);
  };

  const handleWeekChange = (newWeekStart: Date) => {
    setSelectedWeekStart(newWeekStart);
  };


  // 로딩 상태 처리
  if (isLoadingAdditional) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">가격 변동 이력</h3>
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우 여부 확인
  const hasData = activePriceHistory && activePriceHistory.length > 0;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* 헤더 */}
      <div className="mb-6">
        <div className="mb-1">
          <h3 className="text-xl font-bold text-gray-900">가격 변동 이력</h3>
        </div>

        <div className="mb-2">
          <PriceHistoryHeader
            filteredHistory={filteredHistory}
            viewMode={viewMode}
          />
        </div>

        <div className="relative flex items-center justify-end">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <PriceHistoryControls
              priceHistory={activePriceHistory}
              viewMode={viewMode}
              selectedMonth={selectedMonth}
              selectedWeekStart={selectedWeekStart}
              onViewModeChange={handleViewModeChange}
              onMonthChange={handleMonthChange}
              onWeekChange={handleWeekChange}
            />
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
            <button
              onClick={() => handleViewModeChange('daily')}
              className={`text-sm px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'daily'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              일별
            </button>
            <button
              onClick={() => handleViewModeChange('monthly')}
              className={`text-sm px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'monthly'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              월별
            </button>
          </div>
        </div>
      </div>

      {hasData ? (
        <>
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
        </>
      ) : (
        /* 데이터가 없는 경우 */
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">가격 변동 이력이 없습니다.</p>
        </div>
      )}
    </div>
  );
}