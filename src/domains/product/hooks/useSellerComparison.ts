'use client';

import { useState, useMemo } from 'react';
import { SellerInfo } from '@/domains/product/types/product';

export const useSellerComparison = (sellers: SellerInfo[] = []) => {
  const [includeShipping, setIncludeShipping] = useState(true);

  // 판매자 정렬
  const sortedSellers = useMemo(() => {
    return [...sellers].sort((a, b) => {
      const totalA = includeShipping ? a.price + a.shippingFee : a.price;
      const totalB = includeShipping ? b.price + b.shippingFee : b.price;
      return totalA - totalB;
    });
  }, [sellers, includeShipping]);

  const bestSeller = sortedSellers[0];
  const bestPrice = bestSeller ? (includeShipping 
    ? bestSeller.price + bestSeller.shippingFee 
    : bestSeller.price) : 0;

  return {
    sortedSellers,
    bestSeller,
    bestPrice,
    includeShipping,
    setIncludeShipping,
  };
};