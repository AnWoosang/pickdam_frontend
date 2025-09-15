"use client";

import { useState, useEffect, useCallback } from 'react';
import { PROMO_BANNERS, PROMO_BANNER_DEFAULTS } from '../constants/banners';

interface UsePromoBannerProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const usePromoBanner = ({
  autoPlay = true,
  autoPlayInterval = PROMO_BANNER_DEFAULTS.AUTO_PLAY_INTERVAL,
}: UsePromoBannerProps = {}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % PROMO_BANNERS.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length);
  }, []);

  useEffect(() => {
    if (!autoPlay || PROMO_BANNERS.length <= 1) return;

    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, goToNext]);

  return {
    currentSlide,
    currentBanner: PROMO_BANNERS[currentSlide],
    totalSlides: PROMO_BANNERS.length,
    banners: PROMO_BANNERS,
    goToSlide,
    goToNext,
    goToPrevious,
  };
};