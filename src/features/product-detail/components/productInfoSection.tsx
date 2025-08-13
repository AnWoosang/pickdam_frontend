'use client';

import React from 'react';
import { ProductDetail } from '@/types/product';
import { PriceHistoryChart } from './priceHistoryChart';

interface ProductInfoSectionProps {
  product: ProductDetail;
  className?: string;
}

export function ProductInfoSection({ product, className = '' }: ProductInfoSectionProps) {

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 가격 변동 차트 */}
      <PriceHistoryChart product={product} />
    </div>
  );
}