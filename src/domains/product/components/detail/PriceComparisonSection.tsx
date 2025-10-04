'use client';

import React from 'react';
import { ExternalLink, Truck, Package } from 'lucide-react';
import { SellerInfo } from '@/domains/product/types/product';
import { Button } from '@/shared/components/Button';
import { useSellerComparison } from '@/domains/product/hooks/useSellerComparison';
import { formatPrice } from '@/shared/utils/Format';

interface PriceComparisonSectionProps {
  sellers: SellerInfo[];
  className?: string;
}

export function PriceComparisonSection({
  sellers,
  className = ''
}: PriceComparisonSectionProps) {
  // 판매자 비교 기능
  const { sortedSellers, bestSeller, bestPrice, includeShipping, setIncludeShipping, getSellerTotalPrice, getActualShippingFee } = useSellerComparison(sellers);

  const getSavingsPercentage = (currentPrice: number, bestPrice: number) => {
    if (currentPrice === bestPrice) return 0;
    return Math.round(((currentPrice - bestPrice) / bestPrice) * 100);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 헤더 */}
      <div className="p-3 md:p-6 border-gray-200">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">가격 비교</h3>
          <span className="text-xs md:text-sm text-gray-600">{sellers.length}개 판매처</span>
        </div>

        {/* 배송비 포함/제외 토글 */}
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <span className="text-xs md:text-sm text-gray-600">가격 계산:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              onClick={() => setIncludeShipping(false)}
              variant="ghost"
              size="small"
              noFocus
              className={`px-3 py-1 text-xs md:text-sm rounded-md ${
                !includeShipping
                  ? '!bg-white !text-gray-900 shadow-sm hover:!bg-white'
                  : 'text-gray-600 hover:text-gray-900 bg-transparent'
              }`}
            >
              상품가격만
            </Button>
            <Button
              onClick={() => setIncludeShipping(true)}
              variant="ghost"
              size="small"
              noFocus
              className={`px-3 py-1 text-xs md:text-sm rounded-md ${
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
      <div className="px-3 md:px-6 pb-3 md:pb-6 bg-primary-light border-b border-gray-200">
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-bold text-highlight text-base md:text-xl">최저가</span>
            <div className="text-base md:text-xl font-bold text-highlight">
              {formatPrice(bestPrice)}원
            </div>
          </div>
          <div className="text-xs md:text-sm font-semibold text-gray-600">
            {bestSeller?.name || '판매자 정보 없음'}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Package className="w-3 h-3 md:w-4 md:h-4" />
              <span>상품: {formatPrice(bestSeller?.price || 0)}원</span>
            </div>
            {bestSeller && getActualShippingFee(bestSeller) > 0 ? (
              <div className="flex items-center space-x-1">
                <Truck className="w-3 h-3 md:w-4 md:h-4" />
                <span>배송비: {formatPrice(getActualShippingFee(bestSeller))}원</span>
              </div>
            ) : bestSeller ? (
              <div className="flex items-center space-x-1">
                <Truck className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-green-600 font-medium">무료배송</span>
              </div>
            ) : null}
          </div>

          <Button
            onClick={() => bestSeller?.url && window.open(bestSeller.url, '_blank', 'noopener,noreferrer')}
            variant="primary"
            size="small"
            noFocus
            icon={<ExternalLink className="w-3 h-3 md:w-4 md:h-4" />}
            className="inline-flex items-center space-x-1 w-full md:w-auto justify-center"
          >
            구매하기
          </Button>
        </div>
      </div>

      {/* 판매처 목록 */}
      <div className="p-3 md:p-6">
        <div className={`space-y-3 md:space-y-4 ${sortedSellers.length > 5 ? 'max-h-96 overflow-y-auto' : ''}`}>
          {sortedSellers.map((seller, index) => {
            const totalPrice = getSellerTotalPrice(seller);
            const _savings = getSavingsPercentage(totalPrice, bestPrice);
            const isBest = totalPrice === bestPrice;

            return (
              <div
                key={`${seller.name}-${seller.price}-${seller.shippingFee}-${index}`}
                onClick={() => window.open(seller.url, '_blank', 'noopener,noreferrer')}
                className={`p-3 md:p-4 rounded-lg border cursor-pointer transition-colors ${
                  isBest
                    ? 'border-primaryDark bg-primary-light hover:bg-primary/10'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isBest ? 'bg-primary text-white' : 'bg-gray-400 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900 text-sm md:text-base">{seller.name}</span>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-1 md:space-x-2">
                      {isBest && (
                        <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-highlight font-bold text-white text-xs md:text-sm rounded-full">
                          최저가
                        </span>
                      )}
                      <div className="text-base md:text-lg font-bold text-gray-900">
                        {formatPrice(totalPrice)}원
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs md:text-sm text-gray-600">
                  <div className="flex items-center space-x-2 md:space-x-4 flex-1">
                    <span>상품: {formatPrice(seller.price)}원</span>
                    {getActualShippingFee(seller) > 0 ? (
                      <span>배송비: {formatPrice(getActualShippingFee(seller))}원</span>
                    ) : (
                      <span className="text-green-600 font-medium">무료배송</span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="small"
                    noFocus
                    icon={<ExternalLink className="w-3 h-3" />}
                    className="inline-flex items-center space-x-1 text-primary border border-primary hover:bg-primary hover:text-white ml-2 flex-shrink-0"
                  >
                    <span className="hidden md:inline">상품 보기</span>
                    <span className="md:hidden">보기</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {/* 주의사항 */}
        <div className="mt-3 md:mt-4 p-2 md:p-3 bg-blue-50 rounded-lg">
          <p className="text-xs md:text-sm text-blue-800">
            💡 가격은 실시간으로 변동될 수 있으며, 각 쇼핑몰의 할인 혜택이나 적립금은 별도입니다.
          </p>
        </div>
      </div>
    </div>
  );
}