'use client';

import { useState, useMemo, useCallback } from 'react';
import { SellerInfo } from '@/domains/product/types/product';

export const useSellerComparison = (sellers: SellerInfo[] = []) => {
  const [includeShipping, setIncludeShipping] = useState(true);

  // threshold를 고려한 실제 배송비 계산
  const getActualShippingFee = useCallback((seller: SellerInfo) => {
    if (seller.shippingFeeThreshold && seller.price >= seller.shippingFeeThreshold) {
      return 0;
    }
    return seller.shippingFee;
  }, []);

  // seller의 총 가격 계산
  const getSellerTotalPrice = useCallback((seller: SellerInfo) => {
    const actualShippingFee = getActualShippingFee(seller);
    return includeShipping ? seller.price + actualShippingFee : seller.price;
  }, [includeShipping, getActualShippingFee]);

  // 판매자 정렬
  const sortedSellers = useMemo(() => {
    return [...sellers].sort((a, b) => {
      const actualShippingFeeA = getActualShippingFee(a);
      const actualShippingFeeB = getActualShippingFee(b);
      const totalA = includeShipping ? a.price + actualShippingFeeA : a.price;
      const totalB = includeShipping ? b.price + actualShippingFeeB : b.price;
      return totalA - totalB;
    });
  }, [sellers, includeShipping, getActualShippingFee]);

  const bestSeller = sortedSellers[0];
  const bestPrice = bestSeller ? getSellerTotalPrice(bestSeller) : 0;

  return {
    sortedSellers,
    bestSeller,
    bestPrice,
    includeShipping,
    setIncludeShipping,
    getSellerTotalPrice,
    getActualShippingFee,
  };
};