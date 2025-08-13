'use client';

import React from 'react';
import { Star, TrendingUp, Users, Award, Heart, Wind, Zap, Droplets, Info } from 'lucide-react';
import { AverageReviewInfo } from '@/types/product';

interface ReviewAnalysisSectionProps {
  averageReview: AverageReviewInfo;
  className?: string;
}

export function ReviewAnalysisSection({ averageReview, className = '' }: ReviewAnalysisSectionProps) {
  const formatRating = (rating: number) => rating.toFixed(1);

  // 5점 만점을 백분율로 변환
  const getPercentage = (value: number) => Math.round((value / 5) * 100);

  // 평가 지표 데이터
  const metrics = [
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
  ];

  // 별점 분포 (임시 데이터 - 실제로는 API에서 받아와야 함)
  const ratingDistribution = [
    { stars: 5, count: Math.round(averageReview.totalReviewCount * 0.4) },
    { stars: 4, count: Math.round(averageReview.totalReviewCount * 0.3) },
    { stars: 3, count: Math.round(averageReview.totalReviewCount * 0.2) },
    { stars: 2, count: Math.round(averageReview.totalReviewCount * 0.08) },
    { stars: 1, count: Math.round(averageReview.totalReviewCount * 0.02) },
  ];

  // 최고 평가 지표
  const topMetric = metrics.reduce((prev, current) => 
    prev.value > current.value ? prev : current
  );

  // 최저 평가 지표
  const bottomMetric = metrics.reduce((prev, current) => 
    prev.value < current.value ? prev : current
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 리뷰 분석 */}
      <div className="p-6">
        <div className="grid grid-cols-5 gap-6">
          {/* 전체 평점 요약 */}
          <div className="col-span-2">
            <h4 className="text-lg font-bold text-gray-900 mb-4">전체 평점</h4>
            <div className="pt-4 pr-4">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-black mb-2">
                  {formatRating(averageReview.rating)}
                </div>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= averageReview.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {averageReview.totalReviewCount}개 리뷰
                </div>
              </div>

              <div className="space-y-2">
                {ratingDistribution.map((rating) => {
                  const percentage = averageReview.totalReviewCount > 0 
                    ? Math.round((rating.count / averageReview.totalReviewCount) * 100) 
                    : 0;

                  return (
                    <div key={rating.stars} className="flex items-center space-x-2 text-sm">
                      <div className="flex items-center space-x-1 w-8">
                        <span className="text-xs">{rating.stars}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      </div>
                      
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-yellow-400 h-1.5 rounded-full duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      
                      <div className="w-8 text-right text-xs text-gray-600">
                        {rating.count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 상세 평가 */}
          <div className="col-span-3">
            <h4 className="text-lg font-bold text-gray-900 mb-4">상세 평가</h4>
            <div className="pt-4 pr-4">
              <div className="space-y-3">
                {metrics.map((metric) => {
                  const IconComponent = metric.icon;
                  const percentage = getPercentage(metric.value);
                  
                  return (
                    <div key={metric.key}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <IconComponent className={`w-4 h-4 ${metric.color}`} />
                          <span className="text-sm font-medium text-gray-900">
                            {metric.label}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {formatRating(metric.value)}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${metric.bgColor} h-2 rounded-full duration-300`}
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
}