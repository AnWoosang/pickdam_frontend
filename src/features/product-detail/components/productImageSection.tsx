'use client';

import React, { useState } from 'react';
import { Heart, Info, Droplets, Wind, Zap, Star, Share2 } from 'lucide-react';
import { ProductDetail } from '@/types/product';
import { Button } from '@/components/common/button';

interface ProductImageSectionProps {
  product: ProductDetail;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onShare: () => void;
  className?: string;
}

export function ProductImageSection({ 
  product, 
  isWishlisted, 
  onToggleWishlist,
  onShare,
  className = '' 
}: ProductImageSectionProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 최저가 정보
  const lowestPriceSeller = product.sellers.reduce((lowest, seller) => 
    seller.price < lowest.price ? seller : lowest
  );

  // 리뷰 평가 항목들
  const reviewMetrics = [
    {
      key: 'sweetness',
      label: '달콤함',
      value: product.averageReviewInfo.sweetness,
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
    },
    {
      key: 'menthol',
      label: '멘솔감',
      value: product.averageReviewInfo.menthol,
      icon: Wind,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      key: 'throatHit',
      label: '목넘김',
      value: product.averageReviewInfo.throatHit,
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    {
      key: 'freshness',
      label: '신선함',
      value: product.averageReviewInfo.freshness,
      icon: Info,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
  ];

  // 5점 만점을 백분율로 변환
  const getPercentage = (value: number) => (value / 5) * 100;

  // 기본 썸네일과 추가 이미지들을 합쳐서 이미지 배열 생성
  const images = [
    product.thumbnailUrl,
    // 추가 이미지가 있다면 여기에 추가
    'https://via.placeholder.com/400x400.png?text=Image2',
    'https://via.placeholder.com/400x400.png?text=Image3',
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* 메인 이미지 */}
      <div className="relative mb-4 max-w-md mx-auto">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={images[selectedImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover duration-300"
          />
          
          {/* 액션 버튼들 */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              onClick={onToggleWishlist}
              variant="ghost"
              size="small"
              icon={<Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />}
              className={`${isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400'} bg-white bg-opacity-80 hover:bg-opacity-100`}
              noFocus={true}
            />
            
            <Button
              onClick={onShare}
              variant="ghost"
              size="small"
              icon={<Share2 className="w-4 h-4" />}
              className="text-gray-400 bg-white bg-opacity-80 hover:bg-opacity-100"
              noFocus={true}
            />
          </div>
        </div>
      </div>

      {/* 썸네일 이미지들 */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto mt-6">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                selectedImageIndex === index
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* 상품 정보 */}
      <div className="mt-8 space-y-6">
        {/* 기본 스펙 정보 */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">상품 정보</h3>
          <div className="mb-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">상품명</span>
              <span className="text-sm font-medium text-gray-900">{product.name}</span>
            </div>
          </div>
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

        {/* 통계 정보 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-primary">
              {product.totalViews.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">조회수</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-primary">
              {product.totalFavorites.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">찜</div>
          </div>
        </div>
      </div>

    </div>
  );
}