'use client';

import React from 'react';
import Link from 'next/link';
import { ProductPreview } from '@/types/search';
import { Heart, Eye, Star } from 'lucide-react';

interface SearchResultsProps {
  products: ProductPreview[];
  className?: string;
}

export function SearchResults({ products, className = '' }: SearchResultsProps) {

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">상품이 없습니다</h3>
        <p className="text-gray-600">다른 조건으로 검색해보세요</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: ProductPreview;
}

function ProductCard({ product }: ProductCardProps) {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // 카테고리별 배지 색상
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'liquid':
        return 'bg-blue-100 text-blue-800';
      case 'device':
        return 'bg-purple-100 text-purple-800';
      case 'pod':
        return 'bg-green-100 text-green-800';
      case 'coil':
        return 'bg-orange-100 text-orange-800';
      case 'accessory':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'liquid':
        return '액상';
      case 'device':
        return '기기';
      case 'pod':
        return '팟';
      case 'coil':
        return '코일';
      case 'accessory':
        return '액세서리';
      default:
        return category;
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* 상품 이미지 */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* 카테고리 배지 */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeColor(product.productCategory)}`}>
              {getCategoryLabel(product.productCategory)}
            </span>
          </div>

          {/* 찜하기 버튼 */}
          <button
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              // TODO: 찜하기 기능 구현
            }}
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* 상품 정보 */}
        <div className="p-4">
          {/* 브랜드 */}
          <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
          
          {/* 상품명 */}
          <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* 상품 상세 정보 */}
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {product.inhaleType}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {product.flavor}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {product.capacity}
            </span>
          </div>

          {/* 가격 */}
          <div className="text-lg font-bold text-primary mb-3">
            {formatPrice(product.price)}원
          </div>

          {/* 통계 정보 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{formatCount(product.totalViews)}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{formatCount(product.totalFavorites)}</span>
              </div>
            </div>

            {/* 임시 평점 (실제로는 API에서 가져와야 함) */}
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>4.{Math.floor(Math.random() * 8) + 1}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}