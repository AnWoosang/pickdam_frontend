"use client";

import { useMemo, useCallback } from 'react';
import type { LowestPriceHistory } from '@/domains/product/types/product';

type ViewMode = 'daily' | 'monthly';

interface UsePriceHistoryControlsOptions {
  priceHistory: LowestPriceHistory[];
  viewMode: ViewMode;
  selectedMonth: number;
  selectedWeekStart: Date;
}

interface MonthInfo {
  year: number;
  month: number;
  display: string;
}

interface WeekInfo {
  start: Date;
  end: Date;
  display: string;
}

export const usePriceHistoryControls = ({
  priceHistory,
  viewMode: _viewMode,
  selectedMonth,
  selectedWeekStart
}: UsePriceHistoryControlsOptions) => {

  // 월 번호를 년도와 월로 변환
  const getMonthFromNumber = useCallback((monthNumber: number) => {
    const year = Math.floor(monthNumber / 12);
    const month = monthNumber % 12;
    return { year, month };
  }, []);

  // 현재 선택된 월의 정보
  const currentMonthInfo = useMemo((): MonthInfo => {
    const { year, month } = getMonthFromNumber(selectedMonth);
    return {
      year,
      month,
      display: new Date(year, month).toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long' 
      })
    };
  }, [selectedMonth, getMonthFromNumber]);

  // 현재 선택된 주의 정보
  const currentWeekInfo = useMemo((): WeekInfo => {
    const endOfWeek = new Date(selectedWeekStart);
    endOfWeek.setDate(selectedWeekStart.getDate() + 6);
    
    return {
      start: selectedWeekStart,
      end: endOfWeek,
      display: `${selectedWeekStart.getMonth() + 1}/${selectedWeekStart.getDate()} - ${endOfWeek.getMonth() + 1}/${endOfWeek.getDate()}`
    };
  }, [selectedWeekStart]);

  // 네비게이션 제한 계산
  const navigationLimits = useMemo(() => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const minMonth = oneYearAgo.getFullYear() * 12 + oneYearAgo.getMonth();
    const maxMonth = now.getFullYear() * 12 + now.getMonth();
    
    const nextWeek = new Date(selectedWeekStart);
    nextWeek.setDate(selectedWeekStart.getDate() + 7);
    
    return {
      canGoPrevMonth: selectedMonth > minMonth,
      canGoNextMonth: selectedMonth < maxMonth,
      canGoNextWeek: nextWeek <= now,
      minMonth,
      maxMonth
    };
  }, [selectedMonth, selectedWeekStart]);

  // 가장 최근 데이터가 있는 주 계산
  const getMostRecentWeekStart = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return null;

    const mostRecentDate = new Date(priceHistory[priceHistory.length - 1].date);
    const mostRecentWeekStart = new Date(mostRecentDate);
    // 한국식 주 계산: 월요일을 주의 시작일로 설정
    const dayOfWeek = mostRecentDate.getDay(); // 0: 일요일, 1: 월요일...
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 일요일이면 6일 빼기, 그외는 요일-1
    mostRecentWeekStart.setDate(mostRecentDate.getDate() - daysToSubtract);

    return mostRecentWeekStart;
  }, [priceHistory]);

  return {
    // 계산된 정보
    currentMonthInfo,
    currentWeekInfo,
    navigationLimits,
    getMostRecentWeekStart
  };
};