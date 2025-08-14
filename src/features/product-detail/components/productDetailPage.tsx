'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ProductDetail } from '@/types/product';
import { Button } from '@/components/common/Button';

// 컴포넌트 import
import { ProductImageSection } from './productImageSection';
import { ProductInfoSection } from './productInfoSection';  
import { PriceComparisonSection } from './priceComparisonSection';
import { ReviewAnalysisSection } from './reviewAnalysisSection';
import { ReviewListSection } from './reviewListSection';
import { ReviewWriteSection } from './reviewWriteSection';

interface ProductDetailPageProps {
  product: ProductDetail;
  className?: string;
}

export function ProductDetailPage({ product, className = '' }: ProductDetailPageProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [includeShipping, setIncludeShipping] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // 구현 예정: API 호출
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `${product.name} - 픽담에서 최저가를 확인해보세요!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      // 클립보드에 복사
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 클립보드에 복사되었습니다.');
      } catch (error) {
        console.error('클립보드 복사 실패:', error);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 판매자 정렬
  const sortedSellers = [...product.sellers].sort((a, b) => {
    const totalA = includeShipping ? a.price + a.shippingFee : a.price;
    const totalB = includeShipping ? b.price + b.shippingFee : b.price;
    return totalA - totalB;
  });

  const bestSeller = sortedSellers[0];
  const bestPrice = includeShipping 
    ? bestSeller.price + bestSeller.shippingFee 
    : bestSeller.price;

  return (
    <div className={className}>
      {/* 페이지 제목 */}
      <div className="mt-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          상품 상세보기
        </h1>
      </div>

      {/* 메인 컨텐츠 - 데스크톱 레이아웃 */}
      <div className="grid grid-cols-12 gap-8">
        {/* 좌측 - 상품 이미지 및 통합 정보 */}
        <div className="col-span-5">
          <ProductImageSection 
            product={product}
            isWishlisted={isWishlisted}
            onToggleWishlist={handleWishlist}
            onShare={handleShare}
          />
        </div>

        {/* 우측 - 가격 변동 이력 및 추가 정보, 가격 비교 */}
        <div className="col-span-7 space-y-6">
          <ProductInfoSection 
            product={product} 
          />
          
          <PriceComparisonSection
            sellers={sortedSellers}
            includeShipping={includeShipping}
            onToggleIncludeShipping={setIncludeShipping}
            bestPrice={bestPrice}
            bestSeller={bestSeller}
          />
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div className="mt-12 space-y-8">
        <ReviewAnalysisSection 
          averageReview={product.averageReviewInfo}
        />
        
        <ReviewListSection 
          reviews={product.reviews}
          productId={product.id}
        />
        
        <ReviewWriteSection 
          productId={product.id}
        />
      </div>

    </div>
  );
}