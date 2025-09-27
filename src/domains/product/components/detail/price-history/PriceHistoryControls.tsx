import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { LowestPriceHistory } from '@/domains/product/types/product';
import { usePriceHistoryControls } from '@/domains/product/hooks/price-history/usePriceHistoryControls';

type ViewMode = 'daily' | 'monthly';

interface PriceHistoryControlsProps {
  priceHistory: LowestPriceHistory[];
  viewMode: ViewMode;
  selectedMonth: number;
  selectedWeekStart: Date;
  onViewModeChange: (viewMode: ViewMode) => void;
  onMonthChange: (month: number) => void;
  onWeekChange: (weekStart: Date) => void;
}

export function PriceHistoryControls({
  priceHistory,
  viewMode,
  selectedMonth,
  selectedWeekStart,
  onViewModeChange: _onViewModeChange,
  onMonthChange,
  onWeekChange
}: PriceHistoryControlsProps) {

  // 비즈니스 로직만 훅에서 가져오기
  const {
    currentMonthInfo,
    currentWeekInfo,
    navigationLimits
  } = usePriceHistoryControls({
    priceHistory,
    viewMode,
    selectedMonth,
    selectedWeekStart
  });


  // UI 이벤트 핸들러들

  const handlePrevMonth = () => {
    const newMonth = Math.max(selectedMonth - 1, navigationLimits.minMonth);
    if (newMonth !== selectedMonth) {
      onMonthChange(newMonth);

      // 월이 변경되면 해당 월의 첫 주로 selectedWeekStart 업데이트
      const { year, month } = { year: Math.floor(newMonth / 12), month: newMonth % 12 };
      const firstDayOfMonth = new Date(year, month, 1);
      const firstMondayOfMonth = new Date(firstDayOfMonth);

      // 해당 월의 첫 번째 월요일 찾기
      const dayOfWeek = firstDayOfMonth.getDay();
      const daysToMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
      firstMondayOfMonth.setDate(1 + daysToMonday);

      onWeekChange(firstMondayOfMonth);
    }
  };

  const handleNextMonth = () => {
    const newMonth = Math.min(selectedMonth + 1, navigationLimits.maxMonth);
    if (newMonth !== selectedMonth) {
      onMonthChange(newMonth);

      // 월이 변경되면 해당 월의 첫 주로 selectedWeekStart 업데이트
      const { year, month } = { year: Math.floor(newMonth / 12), month: newMonth % 12 };
      const firstDayOfMonth = new Date(year, month, 1);
      const firstMondayOfMonth = new Date(firstDayOfMonth);

      // 해당 월의 첫 번째 월요일 찾기
      const dayOfWeek = firstDayOfMonth.getDay();
      const daysToMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
      firstMondayOfMonth.setDate(1 + daysToMonday);

      onWeekChange(firstMondayOfMonth);
    }
  };

  const handlePrevWeek = () => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(selectedWeekStart.getDate() - 7);

    // 주가 변경되면서 월이 바뀐 경우 selectedMonth도 업데이트
    const newMonth = newDate.getFullYear() * 12 + newDate.getMonth();
    if (newMonth !== selectedMonth) {
      onMonthChange(newMonth);
    }

    onWeekChange(newDate);
  };

  const handleNextWeek = () => {
    const now = new Date();
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(selectedWeekStart.getDate() + 7);

    if (newDate <= now) {
      // 주가 변경되면서 월이 바뀐 경우 selectedMonth도 업데이트
      const newMonth = newDate.getFullYear() * 12 + newDate.getMonth();
      if (newMonth !== selectedMonth) {
        onMonthChange(newMonth);
      }
      onWeekChange(newDate);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center">
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