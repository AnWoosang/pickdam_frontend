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

/**
 * 시작일부터 종료일까지의 모든 날짜 배열을 생성
 */
function getAllDatesInRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(start);

  currentDate.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * 누락된 날짜를 이전 가격으로 채우기 (forward-fill)
 */
function fillMissingDates(
  history: LowestPriceHistory[],
  allDates: Date[]
): LowestPriceHistory[] {
  if (history.length === 0 || allDates.length === 0) {
    return history;
  }

  const historyMap = new Map<string, number>();
  history.forEach(item => {
    const dateKey = new Date(item.date).toISOString().split('T')[0];
    historyMap.set(dateKey, item.price);
  });

  const filledHistory: LowestPriceHistory[] = [];
  let lastPrice: number | null = null;

  for (const date of allDates) {
    const dateKey = date.toISOString().split('T')[0];

    if (historyMap.has(dateKey)) {
      const price = historyMap.get(dateKey)!;
      filledHistory.push({ date: new Date(date), price });
      lastPrice = price;
    } else if (lastPrice !== null) {
      filledHistory.push({ date: new Date(date), price: lastPrice });
    }
  }

  return filledHistory;
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

    // 1단계: 날짜 기준으로 정렬
    const sortedHistory = priceHistory.slice().sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 2단계: 누락된 날짜를 이전 가격으로 채우기
    let filledHistory = sortedHistory;

    if (sortedHistory.length > 0) {
      const firstDate = new Date(sortedHistory[0].date);
      const today = new Date();
      // 오늘 끝까지 포함하도록 시간 설정
      today.setHours(23, 59, 59, 999);

      const allDates = getAllDatesInRange(firstDate, today);
      filledHistory = fillMissingDates(sortedHistory, allDates);
    }

    // 3단계: 뷰 모드에 따라 필터링
    let filtered = filledHistory;

    if (viewMode === 'monthly') {
      const year = Math.floor(selectedMonth / 12);
      const month = selectedMonth % 12;

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === year && itemDate.getMonth() === month;
      });
    } else {
      // 일별 뷰: 선택된 주의 데이터 (월~일 7일간)
      // selectedWeekStart를 로컬 timezone 기준으로 정규화
      const weekStart = new Date(
        selectedWeekStart.getFullYear(),
        selectedWeekStart.getMonth(),
        selectedWeekStart.getDate(),
        0, 0, 0, 0
      );

      const weekEnd = new Date(
        selectedWeekStart.getFullYear(),
        selectedWeekStart.getMonth(),
        selectedWeekStart.getDate() + 6,
        23, 59, 59, 999
      );

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= weekStart && itemDate <= weekEnd;
      });
    }

    return filtered;
  }, [priceHistory, viewMode, selectedMonth, selectedWeekStart]);

  return {
    filteredHistory
  };
};