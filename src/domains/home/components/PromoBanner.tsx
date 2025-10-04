'use client';

import React from 'react';
import { usePromoBanner } from '@/domains/home/hooks/usePromoBanner';
import { PROMO_BANNER_DEFAULTS } from '../constants/banners';

interface PromoBannerProps {
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const PromoBanner = React.memo(function PromoBanner({ 
  className = '',
  autoPlay = true,
  autoPlayInterval = PROMO_BANNER_DEFAULTS.AUTO_PLAY_INTERVAL,
}: PromoBannerProps) {
  const {
    currentSlide,
    currentBanner,
    totalSlides,
    banners,
    goToSlide,
  } = usePromoBanner({
    autoPlay,
    autoPlayInterval,
  });

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentBanner.gradient} text-white p-6 md:p-8 h-[200px] md:h-[260px] ${className}`}>
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


      <div className="relative z-10 h-full flex flex-col">
        {/* 메인 콘텐츠 영역 - 수직 중앙 정렬 */}
        <div className="flex-1 flex flex-col justify-center items-start">
          <div className="w-full">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-6 leading-tight">
              {currentBanner.title}
            </h2>

            <p className="text-sm md:text-xl text-white/90 leading-relaxed">
              {currentBanner.description}
            </p>
          </div>
        </div>

        {/* 인디케이터 - 맨 하단 중앙 위치 */}
        {totalSlides > 1 && (
          <div className="flex justify-center pb-1 md:pb-4 space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors cursor-pointer hover:bg-white/70 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});