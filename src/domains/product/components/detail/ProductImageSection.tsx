'use client';

import React from 'react';
import { Product } from '@/domains/product/types/product';
import { ProductImageGallery } from './ProductImageGallery';
import { ProductBasicInfo } from './ProductBasicInfo';
import { ProductStats } from './ProductStats';

interface ProductImageSectionProps {
  product: Product;
  className?: string;
}

export function ProductImageSection({ 
  product, 
  className = '' 
}: ProductImageSectionProps) {

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-2 md:p-6 ${className}`}>
      {/* 이미지 갤러리 */}
      <ProductImageGallery product={product} />

      {/* 상품 정보 */}
      <div className="mt-3 md:mt-8 space-y-3 md:space-y-6">
        <ProductBasicInfo product={product} />
        <ProductStats product={product} />
      </div>
    </div>
  );
}