import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { LowestPriceHistory } from '@/domains/product/types/product';
import { usePriceHistoryControls } from '@/domains/product/hooks/price-history/usePriceHistoryControls';

type ViewMode = 'daily' | 'monthly';

interface PriceHistoryControlsProps {
  priceHistory: LowestPriceHistory[];
  onViewModeChange: (viewMode: ViewMode, selectedMonth: number, selectedWeekStart: Date) => void;
}

export function PriceHistoryControls({
  priceHistory,
  onViewModeChange
}: PriceHistoryControlsProps) {
  // UI 상태 관리 (컴포넌트에서 직접 관리)
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

  // 비즈니스 로직만 훅에서 가져오기
  const {
    currentMonthInfo,
    currentWeekInfo,
    navigationLimits,
    getMostRecentWeekStart
  } = usePriceHistoryControls({
    priceHistory,
    viewMode,
    selectedMonth,
    selectedWeekStart
  });

  // 일별 뷰에서 데이터가 있는 가장 최근 주로 자동 이동
  useEffect(() => {
    if (viewMode === 'daily' && getMostRecentWeekStart) {
      setSelectedWeekStart(getMostRecentWeekStart);
    }
  }, [viewMode, getMostRecentWeekStart]);

  // 상태 변경을 부모에게 알림
  useEffect(() => {
    onViewModeChange(viewMode, selectedMonth, selectedWeekStart);
  }, [viewMode, selectedMonth, selectedWeekStart, onViewModeChange]);

  // UI 이벤트 핸들러들 (컴포넌트에서 직접 관리)
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handlePrevMonth = () => {
    setSelectedMonth(prev => Math.max(prev - 1, navigationLimits.minMonth));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => Math.min(prev + 1, navigationLimits.maxMonth));
  };

  const handlePrevWeek = () => {
    setSelectedWeekStart(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    const now = new Date();
    setSelectedWeekStart(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate <= now ? newDate : prev;
    });
  };
  return (
    <>
      {/* 뷰 모드 토글 */}
      <div className="flex items-center space-x-2">
        <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
          <Button
            onClick={() => handleViewModeChange('daily')}
            variant="ghost"
            size="small"
            noFocus
            className={`text-sm ${
              viewMode === 'daily'
                ? '!bg-white !text-primary shadow-sm hover:!bg-white'
                : 'text-gray-600 hover:text-gray-800 bg-transparent'
            }`}
          >
            일별
          </Button>
          <Button
            onClick={() => handleViewModeChange('monthly')}
            variant="ghost"
            size="small"
            noFocus
            className={`text-sm ${
              viewMode === 'monthly'
                ? '!bg-white !text-primary shadow-sm hover:!bg-white'
                : 'text-gray-600 hover:text-gray-800 bg-transparent'
            }`}
          >
            월별
          </Button>
        </div>
      </div>

      {/* 기간 선택 네비게이션 */}
      <div className="flex items-center justify-center mb-6 mt-6">
        {viewMode === 'monthly' ? (
          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePrevMonth}
              disabled={!navigationLimits.canGoPrevMonth}
              variant="ghost"
              size="small"
              noFocus
              icon={<ChevronLeft className="w-5 h-5" />}
              className={`p-2 rounded-full ${
                !navigationLimits.canGoPrevMonth && 'opacity-50 cursor-not-allowed'
              }`}
            />
            <div className="text-lg font-semibold text-gray-900 min-w-[120px] text-center">
              {currentMonthInfo.display}
            </div>
            <Button
              onClick={handleNextMonth}
              disabled={!navigationLimits.canGoNextMonth}
              variant="ghost"
              size="small"
              noFocus
              icon={<ChevronRight className="w-5 h-5" />}
              className={`p-2 rounded-full ${
                !navigationLimits.canGoNextMonth && 'opacity-50 cursor-not-allowed'
              }`}
            />
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePrevWeek}
              variant="ghost"
              size="small"
              noFocus
              icon={<ChevronLeft className="w-5 h-5" />}
              className="p-2 rounded-full"
            />
            <div className="text-lg font-semibold text-gray-900 min-w-[120px] text-center">
              {currentWeekInfo.display}
            </div>
            <Button
              onClick={handleNextWeek}
              disabled={!navigationLimits.canGoNextWeek}
              variant="ghost"
              size="small"
              noFocus
              icon={<ChevronRight className="w-5 h-5" />}
              className={`p-2 rounded-full ${
                !navigationLimits.canGoNextWeek && 'opacity-50 cursor-not-allowed'
              }`}
            />
          </div>
        )}
      </div>
    </>
  );
}