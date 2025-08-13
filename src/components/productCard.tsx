"use client";

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { formatKRW } from '@/utils/format';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div 
      className="bg-white rounded-lg border border-grayLight cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="aspect-square relative">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded-t-lg"
        />
        <button
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
          aria-label="찜하기"
          onClick={(e) => {
            e.stopPropagation(); // 상위 div의 onClick 이벤트 방지
            // TODO: 찜하기 기능 구현
          }}
        >
          <Heart className="w-4 h-4 text-gray" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-textHeading line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="text-sm text-textDefault mb-1">
          {product.inhaleType} • {product.flavor} • {product.capacity}
        </div>
        <div className="text-lg font-bold text-primary">
          최저가 {formatKRW(product.price)}
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-hintText">
          <span>조회 {product.totalViews.toLocaleString()}</span>
          <span>찜 {product.totalFavorites.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}