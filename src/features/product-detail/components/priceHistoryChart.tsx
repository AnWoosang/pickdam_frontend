'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingDown, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductDetail } from '@/types/product';
import { Button } from '@/components/common/button';

interface PriceHistoryChartProps {
  product: ProductDetail;
  className?: string;
}

type ViewMode = 'daily' | 'monthly';

interface ChartData {
  date: string;
  displayDate: string;
  fullDate: string;
  price: number;
  originalDate: string;
}

export function PriceHistoryChart({ product, className = '' }: PriceHistoryChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth(); // 현재 년월을 숫자로 표현
  });
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // 주의 시작 (일요일)
    return startOfWeek;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 월 형태로 변환하는 헬퍼 함수
  const getMonthFromNumber = (monthNumber: number) => {
    const year = Math.floor(monthNumber / 12);
    const month = monthNumber % 12;
    return { year, month };
  };

  // 현재 선택된 월의 정보
  const currentMonthInfo = useMemo(() => {
    const { year, month } = getMonthFromNumber(selectedMonth);
    return {
      year,
      month,
      display: new Date(year, month).toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long' 
      })
    };
  }, [selectedMonth]);

  // 현재 선택된 주의 정보
  const currentWeekInfo = useMemo(() => {
    const endOfWeek = new Date(selectedWeekStart);
    endOfWeek.setDate(selectedWeekStart.getDate() + 6);
    
    return {
      start: selectedWeekStart,
      end: endOfWeek,
      display: `${selectedWeekStart.getMonth() + 1}/${selectedWeekStart.getDate()} - ${endOfWeek.getMonth() + 1}/${endOfWeek.getDate()}`
    };
  }, [selectedWeekStart]);

  // 데이터 필터링 (월별/일별에 따라 다르게)
  const filteredHistory = useMemo(() => {
    let filtered = product.lowestPriceHistory.slice();
    
    if (viewMode === 'monthly') {
      // 월별: 1년 이내 데이터만
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      filtered = filtered.filter(item => new Date(item.date) >= oneYearAgo);
    } else {
      // 일별: 선택된 주의 데이터만
      const weekStart = new Date(selectedWeekStart);
      const weekEnd = new Date(selectedWeekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= weekStart && itemDate < weekEnd;
      });
    }
    
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [product.lowestPriceHistory, viewMode, selectedWeekStart]);


  // 차트 데이터 처리
  const chartData = useMemo(() => {
    if (viewMode === 'daily') {
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
    } else {
      // 월별 뷰: 선택된 월의 모든 데이터 표시
      const { year, month } = currentMonthInfo;
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0); // 해당 월의 마지막 날
      
      return filteredHistory
        .filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= monthStart && itemDate <= monthEnd;
        })
        .map(item => ({
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
    }
  }, [filteredHistory, viewMode, currentMonthInfo]);

  // 가격 변동률 계산
  const priceChange = useMemo(() => {
    if (chartData.length < 2) return null;
    
    const oldPrice = chartData[0].price;
    const currentPrice = chartData[chartData.length - 1].price;
    const change = currentPrice - oldPrice;
    const changePercent = ((change / oldPrice) * 100).toFixed(1);
    
    return {
      amount: change,
      percent: changePercent,
      isIncrease: change > 0
    };
  }, [chartData]);

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{data.fullDate}</p>
          <p className="text-lg font-bold text-primary">
            {formatPrice(payload[0].value)}원
          </p>
        </div>
      );
    }
    return null;
  };

  // 네비게이션 핸들러
  const handlePrevMonth = () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const minMonth = oneYearAgo.getFullYear() * 12 + oneYearAgo.getMonth();
    
    setSelectedMonth(prev => Math.max(prev - 1, minMonth));
  };

  const handleNextMonth = () => {
    const now = new Date();
    const maxMonth = now.getFullYear() * 12 + now.getMonth();
    
    setSelectedMonth(prev => Math.min(prev + 1, maxMonth));
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
      // 미래로는 이동하지 않음
      return newDate <= now ? newDate : prev;
    });
  };

  // 네비게이션 가능 여부 확인
  const canGoPrevMonth = useMemo(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const minMonth = oneYearAgo.getFullYear() * 12 + oneYearAgo.getMonth();
    return selectedMonth > minMonth;
  }, [selectedMonth]);

  const canGoNextMonth = useMemo(() => {
    const now = new Date();
    const maxMonth = now.getFullYear() * 12 + now.getMonth();
    return selectedMonth < maxMonth;
  }, [selectedMonth]);

  const canGoNextWeek = useMemo(() => {
    const nextWeek = new Date(selectedWeekStart);
    nextWeek.setDate(selectedWeekStart.getDate() + 7);
    return nextWeek <= new Date();
  }, [selectedWeekStart]);

  if (chartData.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">가격 변동 이력</h3>
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">
            {viewMode === 'daily' ? '선택된 주에 가격 변동 이력이 없습니다.' : '가격 변동 이력이 없습니다.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">가격 변동 이력</h3>
          <div className="flex items-center space-x-4 mt-1 h-6">
            {priceChange && (
              <div className={`flex items-center space-x-2 text-sm ${
                priceChange.isIncrease ? 'text-red-500' : 'text-green-500'
              }`}>
                {priceChange.isIncrease ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{formatPrice(Math.abs(priceChange.amount))}원</span>
                <span>({priceChange.isIncrease ? '+' : ''}{priceChange.percent}%)</span>
              </div>
            )}
            {viewMode === 'monthly' && (
              <p className="text-xs text-gray-500">최대 1년까지의 데이터를 제공합니다</p>
            )}
          </div>
        </div>
        
        {/* 뷰 모드 토글 */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
            <Button
              onClick={() => setViewMode('daily')}
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
              onClick={() => setViewMode('monthly')}
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
      </div>

      {/* 기간 선택 네비게이션 */}
      <div className="flex items-center justify-center mb-6">
        {viewMode === 'monthly' ? (
          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePrevMonth}
              disabled={!canGoPrevMonth}
              variant="ghost"
              size="small"
              noFocus
              icon={<ChevronLeft className="w-5 h-5" />}
              className={`p-2 rounded-full ${
                !canGoPrevMonth && 'opacity-50 cursor-not-allowed'
              }`}
            />
            <div className="text-lg font-semibold text-gray-900 min-w-[120px] text-center">
              {currentMonthInfo.display}
            </div>
            <Button
              onClick={handleNextMonth}
              disabled={!canGoNextMonth}
              variant="ghost"
              size="small"
              noFocus
              icon={<ChevronRight className="w-5 h-5" />}
              className={`p-2 rounded-full ${
                !canGoNextMonth && 'opacity-50 cursor-not-allowed'
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
              disabled={!canGoNextWeek}
              variant="ghost"
              size="small"
              noFocus
              icon={<ChevronRight className="w-5 h-5" />}
              className={`p-2 rounded-full ${
                !canGoNextWeek && 'opacity-50 cursor-not-allowed'
              }`}
            />
          </div>
        )}
      </div>

      {/* 차트 */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData} 
            margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
            key={`${viewMode}-${selectedMonth}-${selectedWeekStart.getTime()}`}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickFormatter={(value) => value.toLocaleString()}
              domain={['dataMin', 'dataMax']}
              tickCount={5}
            />
            <Tooltip 
              content={<CustomTooltip />}
              animationDuration={0}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4682b4"
              strokeWidth={3}
              dot={{ fill: '#4682b4', strokeWidth: 2, r: 4 }}
              activeDot={{ 
                r: 6, 
                stroke: '#4682b4', 
                strokeWidth: 2, 
                fill: '#ffffff',
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 요약 정보 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">최고가</div>
            <div className="text-lg font-bold text-black-500">
              {formatPrice(Math.max(...chartData.map(d => d.price)))}원
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">최저가</div>
            <div className="text-lg font-bold text-black">
              {formatPrice(Math.min(...chartData.map(d => d.price)))}원
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">현재가</div>
            <div className="text-lg font-bold text-black">
              {formatPrice(chartData[chartData.length - 1]?.price || 0)}원
            </div>
          </div>
        </div>

        {/* 가격 차이 설명 */}
        <div className={`rounded-lg p-4 text-center ${
          chartData[chartData.length - 1]?.price === Math.max(...chartData.map(d => d.price))
            ? 'bg-red-50'
            : 'bg-green-50'
        }`}>
          <div className={`text-lg font-bold ${
            chartData[chartData.length - 1]?.price === Math.max(...chartData.map(d => d.price))
              ? 'text-red-700'
              : 'text-green-700'
          }`}>
            {chartData[chartData.length - 1]?.price === Math.max(...chartData.map(d => d.price))
              ? `현재 가격이 ${viewMode === 'daily' ? '이번 주' : '이번 달'} 최고가예요`
              : `${viewMode === 'daily' ? '이번 주' : '이번 달'} 최고가 대비 ${formatPrice(Math.max(...chartData.map(d => d.price)) - Math.min(...chartData.map(d => d.price)))}원 더 싼 가격이에요`
            }
          </div>
        </div>
      </div>
    </div>
  );
}