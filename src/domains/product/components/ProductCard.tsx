"use client";

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { Product } from '@/domains/product/types/product';
import { getInhaleTypeDisplayName, getProductCategoryDisplayName } from '@/domains/product/types/category';
import { formatKRW } from '@/shared/utils/Format';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {

  // 썸네일 이미지 URL, 없으면 null
  const imageUrl = product.thumbnailImageUrl && product.thumbnailImageUrl.trim() !== '' 
    ? product.thumbnailImageUrl 
    : null;

  return (
    <div 
      className="bg-white rounded-lg border border-grayLight cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="aspect-square relative bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center rounded-t-lg">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4 h-32 flex flex-col">
        <h3 className="font-medium text-textHeading line-clamp-2 h-12 flex items-start">
          {product.name}
        </h3>
        <div className="text-xs text-textDefault mb-1 flex-shrink-0">
          {getProductCategoryDisplayName(product.productCategory)} • {getInhaleTypeDisplayName(product.inhaleType)} • {product.capacity}ml
        </div>
        <div className="text-lg font-bold text-primary flex-shrink-0">
          최저가 {formatKRW(product.price)}
        </div>
      </div>
    </div>
  );
}