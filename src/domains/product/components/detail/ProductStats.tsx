import React from 'react';
import { Product } from '@/domains/product/types/product';

interface ProductStatsProps {
  product: Product;
  className?: string;
}

export function ProductStats({ 
  product, 
  className = '' 
}: ProductStatsProps) {
  return (
    <div className={`grid grid-cols-2 gap-1.5 md:gap-4 ${className}`}>
      <div className="text-center p-1.5 md:p-3 bg-gray-50 rounded-md md:rounded-lg">
        <div className="text-sm md:text-xl font-bold text-primary">
          {(product.totalViews || 0).toLocaleString()}
        </div>
        <div className="text-[10px] md:text-xs text-gray-600">조회수</div>
      </div>

      <div className="text-center p-1.5 md:p-3 bg-gray-50 rounded-md md:rounded-lg">
        <div className="text-sm md:text-xl font-bold text-primary">
          {(product.totalFavorites || 0).toLocaleString()}
        </div>
        <div className="text-[10px] md:text-xs text-gray-600">찜</div>
      </div>
    </div>
  );
}