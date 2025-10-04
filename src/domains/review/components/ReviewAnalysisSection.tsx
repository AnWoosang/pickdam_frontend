'use client';

import React from 'react';
import { Star, Heart, Wind, Zap, Droplets, Info } from 'lucide-react';
import { AverageReviewInfo } from '@/domains/review/types/review';

// 상수 정의
const MAX_RATING = 5;
const RATING_STARS = [1, 2, 3, 4, 5] as const;

interface ReviewAnalysisSectionProps {
  averageReview: AverageReviewInfo;
  className?: string;
}

export const ReviewAnalysisSection = React.memo<ReviewAnalysisSectionProps>(function ReviewAnalysisSection({ averageReview, className = '' }) {
  const formatRating = React.useCallback((rating: number | undefined) => (rating ?? 0).toFixed(1), []);

  // 최대 평점을 백분율로 변환
  const getPercentage = React.useCallback((value: number | undefined) => Math.round(((value ?? 0) / MAX_RATING) * 100), []);

  // 평가 지표 데이터 (메모이제이션)
  const metrics = React.useMemo(() => [
    {
      key: 'sweetness',
      label: '달콤함',
      value: averageReview.sweetness,
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500',
      description: '단맛의 강도'
    },
    {
      key: 'menthol',
      label: '멘솔감',
      value: averageReview.menthol,
      icon: Wind,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      description: '시원함과 멘솔 강도'
    },
    {
      key: 'throatHit',
      label: '목넘김',
      value: averageReview.throatHit,
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500',
      description: '흡입 시 목의 자극감'
    },
    {
      key: 'body',
      label: '바디감',
      value: averageReview.body,
      icon: Droplets,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500',
      description: '연기의 농도와 무게감'
    },
    {
      key: 'freshness',
      label: '신선함',
      value: averageReview.freshness,
      icon: Info,
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      description: '향의 선명도와 자연스러움'
    },
  ], [averageReview.sweetness, averageReview.menthol, averageReview.throatHit, averageReview.body, averageReview.freshness]);

  // 별점 분포 데이터 (null/undefined 안전성 추가)
  const ratingDistribution = React.useMemo(() => 
    averageReview.ratingDistribution || [], 
    [averageReview.ratingDistribution]
  );

  // 안전한 총 리뷰 수
  const totalReviewCount = averageReview.totalReviewCount || 0;

  // 안전한 평점
  const safeRating = averageReview.rating || 0;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 리뷰 분석 */}
      <div className="p-3 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          {/* 전체 평점 요약 */}
          <div className="md:col-span-2">
            <h4 className="text-sm md:text-lg font-bold text-gray-900 mb-3 md:mb-4">전체 평점</h4>
            <div className="md:pt-4 md:pr-4">
              <div className="text-center mb-3 md:mb-4">
                <div className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">
                  {formatRating(safeRating)}
                </div>
                <div className="flex items-center justify-center space-x-1 mb-1 md:mb-2">
                  {RATING_STARS.map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 md:w-4 md:h-4 ${
                        star <= safeRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {totalReviewCount}개 리뷰
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                {ratingDistribution.map((rating) => {
                  const percentage = totalReviewCount > 0
                    ? Math.round(((rating?.count || 0) / totalReviewCount) * 100)
                    : 0;

                  return (
                    <div key={rating?.stars || 0} className="flex items-center space-x-2 text-xs md:text-sm">
                      <div className="flex items-center space-x-1 w-6 md:w-8">
                        <span className="text-[10px] md:text-xs">{rating?.stars || 0}</span>
                        <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-400 fill-current" />
                      </div>

                      <div className="flex-1 bg-gray-200 rounded-full h-1 md:h-1.5">
                        <div
                          className="bg-yellow-400 h-1 md:h-1.5 rounded-full duration-300"
                          style={{ width: `${Math.max(0, percentage)}%` }}
                        />
                      </div>

                      <div className="w-6 md:w-8 text-right text-[10px] md:text-xs text-gray-600">
                        {rating?.count || 0}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 상세 평가 */}
          <div className="md:col-span-3">
            <h4 className="text-sm md:text-lg font-bold text-gray-900 mb-3 md:mb-4">상세 평가</h4>
            <div className="md:pt-4 md:pr-4">
              <div className="space-y-2 md:space-y-3">
                {metrics.map((metric) => {
                  const IconComponent = metric.icon;
                  const percentage = getPercentage(metric.value);

                  return (
                    <div key={metric.key}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1.5 md:space-x-2">
                          <IconComponent className={`w-3 h-3 md:w-4 md:h-4 ${metric.color}`} />
                          <span className="text-xs md:text-sm font-medium text-gray-900">
                            {metric.label}
                          </span>
                        </div>
                        <span className="text-xs md:text-sm font-bold text-gray-900">
                          {formatRating(metric.value)}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                        <div
                          className={`${metric.bgColor} h-1.5 md:h-2 rounded-full duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});