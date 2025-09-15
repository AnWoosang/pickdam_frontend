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
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="text-xl font-bold text-primary">
          {(product.totalViews || 0).toLocaleString()}
        </div>
        <div className="text-xs text-gray-600">조회수</div>
      </div>
      
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="text-xl font-bold text-primary">
          {(product.totalFavorites || 0).toLocaleString()}
        </div>
        <div className="text-xs text-gray-600">찜</div>
      </div>
    </div>
  );
}