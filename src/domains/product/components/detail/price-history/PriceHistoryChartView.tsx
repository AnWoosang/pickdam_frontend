import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LowestPriceHistory } from '@/domains/product/types/product';
import { formatPrice } from '@/shared/utils/Format';
import { useChartData } from '@/domains/product/hooks/price-history/useChartData';

interface PriceHistoryChartViewProps {
  filteredHistory: LowestPriceHistory[];
  viewMode: 'daily' | 'monthly';
}

export function PriceHistoryChartView({
  filteredHistory,
  viewMode
}: PriceHistoryChartViewProps) {
  // 차트 데이터 변환
  const { chartData } = useChartData({
    filteredHistory,
    viewMode
  });
  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{ payload: { date: string; price: number; originalDate: string } }>;
    label?: string
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      // ISO 날짜에서 날짜 부분만 추출 (YYYY-MM-DD)
      const formatTooltipDate = (isoDate: string) => {
        return isoDate.split('T')[0];
      };

      return (
        <div className="bg-white p-2 md:p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-xs md:text-sm text-gray-600">{formatTooltipDate(data.originalDate)}</p>
          <p className="text-sm md:text-lg font-bold text-primary">
            {formatPrice(data.price)}원
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-xs md:text-base text-gray-500">
            {viewMode === 'daily' ? '선택된 주에 가격 변동 이력이 없습니다.' : '선택된 월에 가격 변동 이력이 없습니다.'}
          </p>
          <p className="text-[10px] md:text-sm text-gray-400 mt-1">
            다른 기간을 선택해보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
        key={`${viewMode}-${filteredHistory.length}`}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="displayDate"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: window.innerWidth < 768 ? 9 : 12, fill: '#6b7280' }}
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
  );
}