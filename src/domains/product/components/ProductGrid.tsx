'use client';

import React from 'react';
import { Product } from '@/domains/product/types/product';
import { ProductCard } from './ProductCard';
import { Pagination } from '@/shared/components/Pagination';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  hasError: boolean;
  currentPage: number;
  totalPages: number;
  onProductClick: (productId: string) => void;
  onPageChange: (page: number) => void;
}

export function ProductGrid({
  products,
  isLoading,
  hasError,
  currentPage,
  totalPages,
  onProductClick,
  onPageChange
}: ProductGridProps) {
  // 에러 상태
  if (hasError) {
    return (
      <ErrorMessage 
        message="상품을 불러오는데 실패했습니다."
      />
    );
  }

  // 상품이 있는 경우
  if (products.length > 0) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick(product.id)}
            />
          ))}
        </div>

        {/* 페이징 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </>
    );
  }

  // 빈 상태 (로딩 중이 아닐 때만)
  if (!isLoading) {
    return (
      <div className="text-center py-16">
        <div className="text-hintText mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-textHeading mb-2">
          해당 조건에 맞는 상품이 없습니다
        </h3>
        <p className="text-textDefault">
          다른 검색어나 필터 조건을 시도해보세요.
        </p>
      </div>
    );
  }

  // 로딩 중일 때는 아무것도 렌더링하지 않음 (상위에서 로딩 처리)
  return null;
}