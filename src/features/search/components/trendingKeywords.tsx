'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { mockTrendingKeywords } from '@/constants/search-mock-data';
import { TrendingKeyword } from '@/types/search';

interface TrendingKeywordsProps {
  onKeywordClick: (keyword: string) => void;
  className?: string;
}

export function TrendingKeywords({ onKeywordClick, className = '' }: TrendingKeywordsProps) {
  // 변화 상태 아이콘 및 색상
  const getChangeIcon = (status: TrendingKeyword['changeStatus']) => {
    switch (status) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case 'new':
        return <Sparkles className="w-4 h-4 text-green-500" />;
      case 'same':
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getChangeText = (status: TrendingKeyword['changeStatus']) => {
    switch (status) {
      case 'up':
        return '상승';
      case 'down':
        return '하락';
      case 'new':
        return '신규';
      case 'same':
      default:
        return '유지';
    }
  };

  const getChangeColor = (status: TrendingKeyword['changeStatus']) => {
    switch (status) {
      case 'up':
        return 'text-red-500';
      case 'down':
        return 'text-blue-500';
      case 'new':
        return 'text-green-500';
      case 'same':
      default:
        return 'text-gray-500';
    }
  };

  const formatSearchCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}만`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toLocaleString();
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          인기 검색어
        </h2>
        <span className="text-sm text-gray-500">실시간 업데이트</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockTrendingKeywords.map((keyword) => (
          <div
            key={keyword.id}
            className="flex items-center justify-between p-3 rounded-lg group"
            onClick={() => onKeywordClick(keyword.keyword)}
          >
            <div className="flex items-center space-x-3">
              {/* 순위 */}
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                keyword.rank <= 3 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {keyword.rank}
              </div>

              {/* 키워드 */}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {keyword.keyword}
                </div>
                <div className="text-xs text-gray-500">
                  {formatSearchCount(keyword.searchCount)} 회 검색
                </div>
              </div>
            </div>

            {/* 변화 상태 */}
            <div className={`flex items-center space-x-1 ${getChangeColor(keyword.changeStatus)}`}>
              {getChangeIcon(keyword.changeStatus)}
              <span className="text-xs font-medium">
                {getChangeText(keyword.changeStatus)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 추가 정보 */}
      <div className="mt-6 flex flex-wrap gap-2">
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-red-500" />
            <span>상승</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <TrendingDown className="w-3 h-3 text-blue-500" />
            <span>하락</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-green-500" />
            <span>신규</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Minus className="w-3 h-3 text-gray-400" />
            <span>유지</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-orange-50 rounded-lg">
        <p className="text-sm text-orange-800">
          🔥 인기 키워드는 지난 24시간 검색량을 기준으로 실시간 업데이트됩니다.
        </p>
      </div>
    </div>
  );
}