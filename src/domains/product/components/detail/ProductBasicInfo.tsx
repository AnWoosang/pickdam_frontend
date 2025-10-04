import React from 'react';
import { Product } from '@/domains/product/types/product';

interface ProductBasicInfoProps {
  product: Product;
  className?: string;
}

export function ProductBasicInfo({ 
  product, 
  className = '' 
}: ProductBasicInfoProps) {
  return (
    <div className={className}>
      <h3 className="text-sm md:text-xl font-semibold text-gray-900 mb-2 md:mb-4">상품 정보</h3>

      {/* 상품명 강조 */}
      <div className="mb-1.5 md:mb-3 p-1.5 md:p-3 bg-blue-50 rounded-md md:rounded-lg">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] md:text-sm text-gray-600 flex-shrink-0">상품명</span>
          <span className="text-[11px] md:text-sm font-medium text-gray-900 text-right truncate">{product.name}</span>
        </div>
      </div>

      {/* 상품 스펙 정보 */}
      <div className="grid grid-cols-2 gap-1.5 md:gap-3">
        <div className="flex items-center justify-between py-1 px-1.5 md:py-2 md:px-3 bg-gray-50 rounded-md md:rounded-lg">
          <span className="text-[11px] md:text-sm text-gray-600">호흡방식</span>
          <span className="px-1.5 py-0.5 md:px-3 md:py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] md:text-sm">
            {product.inhaleType}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 px-1.5 md:py-2 md:px-3 bg-gray-50 rounded-md md:rounded-lg">
          <span className="text-[11px] md:text-sm text-gray-600">용량</span>
          <span className="text-[11px] md:text-sm font-medium">{product.capacity}ml</span>
        </div>

        <div className="flex items-center justify-between py-1 px-1.5 md:py-2 md:px-3 bg-gray-50 rounded-md md:rounded-lg col-span-2">
          <span className="text-[11px] md:text-sm text-gray-600">카테고리</span>
          <span className="text-[11px] md:text-sm font-medium capitalize">{product.productCategory}</span>
        </div>
      </div>
    </div>
  );
}