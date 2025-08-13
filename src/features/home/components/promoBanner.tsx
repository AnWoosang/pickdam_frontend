'use client';

import React from 'react';
import { Search, TrendingDown, Award, Zap } from 'lucide-react';

interface PromoBannerProps {
  className?: string;
}

export function PromoBanner({ className = '' }: PromoBannerProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white p-8 ${className}`}>
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
            <defs>
              <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="white" fillOpacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        {/* 메인 텍스트 */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div className="flex-1 mb-6 lg:mb-0">
            <h2 className="text-3xl lg:text-4xl font-bold mt-4 mb-4 leading-tight">
              전자담배 상품을 <br className="lg:hidden" />
              <span className="text-yellow-300">최저가</span>로 찾아드려요! 🔍
            </h2>
            
            <p className="text-xl text-white/90 mb-6 leading-relaxed">
              시중의 모든 전자담배 관련 상품을 한 번에 비교하고 <br className="hidden lg:block" />
              가장 저렴한 가격을 안내해드리는 스마트한 쇼핑 서비스입니다
            </p>

            {/* 주요 기능 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center bg-white/10 rounded-lg p-3">
                <TrendingDown className="w-5 h-5 text-yellow-300 mr-2" />
                <span className="text-sm font-medium">최저가 보장</span>
              </div>
              <div className="flex items-center bg-white/10 rounded-lg p-3">
                <Award className="w-5 h-5 text-yellow-300 mr-2" />
                <span className="text-sm font-medium">실시간 가격 비교</span>
              </div>
              <div className="flex items-center bg-white/10 rounded-lg p-3">
                <Zap className="w-5 h-5 text-yellow-300 mr-2" />
                <span className="text-sm font-medium">빠른 검색</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-white text-primary font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-lg">
              상품 검색하기
            </button>
            <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-primary transition-all duration-200">
              서비스 소개
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}