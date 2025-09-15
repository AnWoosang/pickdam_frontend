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
      <h3 className="text-xl font-semibold text-gray-900 mb-4">상품 정보</h3>
      
      {/* 상품명 강조 */}
      <div className="mb-3 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">상품명</span>
          <span className="text-sm font-medium text-gray-900">{product.name}</span>
        </div>
      </div>

      {/* 상품 스펙 정보 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">호흡방식</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {product.inhaleType}
          </span>
        </div>
        
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">용량</span>
          <span className="text-sm font-medium">{product.capacity}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">플레이버</span>
          <span className="text-sm font-medium">{product.flavor}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">카테고리</span>
          <span className="text-sm font-medium capitalize">{product.productCategory}</span>
        </div>
      </div>
    </div>
  );
}