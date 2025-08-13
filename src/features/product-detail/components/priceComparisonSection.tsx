'use client';

import React from 'react';
import { TrendingDown, TrendingUp, ExternalLink, Truck, Package } from 'lucide-react';
import { SellerInfo } from '@/types/product';
import { Button } from '@/components/common/button';

interface PriceComparisonSectionProps {
  sellers: SellerInfo[];
  includeShipping: boolean;
  onToggleIncludeShipping: (include: boolean) => void;
  bestPrice: number;
  bestSeller: SellerInfo;
  className?: string;
}

export function PriceComparisonSection({
  sellers,
  includeShipping,
  onToggleIncludeShipping,
  bestPrice,
  bestSeller,
  className = ''
}: PriceComparisonSectionProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getSellerTotalPrice = (seller: SellerInfo) => {
    return includeShipping ? seller.price + seller.shippingFee : seller.price;
  };

  const getSavingsPercentage = (currentPrice: number, bestPrice: number) => {
    if (currentPrice === bestPrice) return 0;
    return Math.round(((currentPrice - bestPrice) / bestPrice) * 100);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 헤더 */}
      <div className="p-6 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">가격 비교</h3>
          <span className="text-sm text-gray-600">{sellers.length}개 판매처</span>
        </div>

        {/* 배송비 포함/제외 토글 */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">가격 계산:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              onClick={() => onToggleIncludeShipping(false)}
              variant="ghost"
              size="small"
              noFocus
              className={`px-3 py-1 text-sm rounded-md ${
                !includeShipping
                  ? '!bg-white !text-gray-900 shadow-sm hover:!bg-white'
                  : 'text-gray-600 hover:text-gray-900 bg-transparent'
              }`}
            >
              상품가격만
            </Button>
            <Button
              onClick={() => onToggleIncludeShipping(true)}
              variant="ghost"
              size="small"
              noFocus
              className={`px-3 py-1 text-sm rounded-md ${
                includeShipping
                  ? '!bg-white !text-gray-900 shadow-sm hover:!bg-white'
                  : 'text-gray-600 hover:text-gray-900 bg-transparent'
              }`}
            >
              배송비 포함
            </Button>
          </div>
        </div>
      </div>

      {/* 최저가 하이라이트 */}
      <div className="px-6 pb-6 bg-primary-light border-b border-gray-200">
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-bold text-highlight text-xl">최저가</span>
            <div className="text-xl font-bold text-highlight">
              {formatPrice(bestPrice)}원
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-600">
            {bestSeller.name}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4" />
              <span>상품: {formatPrice(bestSeller.price)}원</span>
            </div>
            {bestSeller.shippingFee > 0 && (
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span>배송비: {formatPrice(bestSeller.shippingFee)}원</span>
              </div>
            )}
          </div>
          
          <Button
            onClick={() => window.open(bestSeller.url, '_blank', 'noopener,noreferrer')}
            variant="primary"
            size="medium"
            noFocus
            icon={<ExternalLink className="w-4 h-4" />}
            className="inline-flex items-center space-x-1"
          >
            구매하기
          </Button>
        </div>
      </div>

      {/* 판매처 목록 */}
      <div className="p-6">
        <div className={`space-y-4 ${sellers.length > 5 ? 'max-h-96 overflow-y-auto' : ''}`}>
          {sellers.map((seller, index) => {
            const totalPrice = getSellerTotalPrice(seller);
            const savings = getSavingsPercentage(totalPrice, bestPrice);
            const isBest = totalPrice === bestPrice;

            return (
              <div
                key={seller.name}
                onClick={() => window.open(seller.url, '_blank', 'noopener,noreferrer')}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  isBest
                    ? 'border-primaryDark bg-primary-light hover:bg-primary/10'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isBest ? 'bg-primary text-white' : 'bg-gray-400 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{seller.name}</span>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {isBest && (
                        <span className="px-2 py-1 bg-highlight font-bold text-white text-sm rounded-full">
                          최저가
                        </span>
                      )}
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(totalPrice)}원
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span>상품: {formatPrice(seller.price)}원</span>
                    {seller.shippingFee > 0 ? (
                      <span>배송비: {formatPrice(seller.shippingFee)}원</span>
                    ) : (
                      <span className="text-green-600 font-medium">무료배송</span>
                    )}
                  </div>

                  <Button
                    onClick={() => window.open(seller.url, '_blank', 'noopener,noreferrer')}
                    variant="ghost"
                    size="small"
                    noFocus
                    icon={<ExternalLink className="w-3 h-3" />}
                    className="inline-flex items-center space-x-1 text-primary border border-primary hover:bg-primary hover:text-white"
                  >
                    상품 보기
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {/* 주의사항 */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 가격은 실시간으로 변동될 수 있으며, 각 쇼핑몰의 할인 혜택이나 적립금은 별도입니다.
          </p>
        </div>
      </div>
    </div>
  );
}