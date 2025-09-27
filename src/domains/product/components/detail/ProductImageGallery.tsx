'use client';

import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import { Product } from '@/domains/product/types/product';
import { Button } from '@/shared/components/Button';
import { ImageGallery } from '../ImageGallery';
import { useProductImageGallery } from '@/domains/product/hooks/useProductImageGallery';

interface ProductImageGalleryProps {
  product: Product;
  className?: string;
}

export function ProductImageGallery({ 
  product, 
  className = '' 
}: ProductImageGalleryProps) {
  const {
    images,
    user,
    isWishlisted,
    handleShare,
    handleWishlistToggle
  } = useProductImageGallery({ product });

  return (
    <div className={`relative mb-4 max-w-md mx-auto ${className}`}>
      <div className="relative">
        <ImageGallery
          images={images}
          alt={product.name}
          priority={true}
          className="relative"
          imageClassName="relative"
        />
        
        {/* 액션 버튼들 - 이미지 위에 절대 위치 */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          {user && (
            <Button
              onClick={handleWishlistToggle}
              variant="ghost"
              size="small"
              icon={<Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />}
              className={`${isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400'} bg-white bg-opacity-80 hover:bg-opacity-100`}
              noFocus={true}
            />
          )}
          
          <Button
            onClick={handleShare}
            variant="ghost"
            size="small"
            icon={<Share2 className="w-4 h-4" />}
            className="text-gray-400 bg-white bg-opacity-80 hover:bg-opacity-100"
            noFocus={true}
          />
        </div>
      </div>
    </div>
  );
}