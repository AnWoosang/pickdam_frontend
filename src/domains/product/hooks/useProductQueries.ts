'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi } from '@/domains/product/api/productApi'
import { productKeys } from '@/domains/product/constants/productQueryKeys'
import { ProductsRequestParamDto } from '@/domains/product/types/dto/productRequestDto'
import { ProductDetail } from '@/domains/product/types/product'

// 상품 목록 조회 (페이지네이션)
export const useProducts = (params: ProductsRequestParamDto = {}) => {
  return useQuery({
    queryKey: [...productKeys.products(), params],
    queryFn: () => productApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5분
  })
}

// 상품 상세 조회
export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: productKeys.product(productId),
    queryFn: () => productApi.getProductDetail(productId),
    enabled: !!productId,
  })
}

// 상품 조회수 증가 Mutation (간소화)
export const useIncrementProductViews = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId }: { 
      productId: string; 
    }) => productApi.incrementProductViews(productId),
    onSuccess: (newViewCount, { productId }) => {
      // 상품 상세 캐시에서 조회수 업데이트
      queryClient.setQueryData(productKeys.product(productId), (old: unknown) => {
        if (!old) return old
        const oldData = old as ProductDetail
        return {
          ...oldData,
          totalViews: newViewCount
        }
      })
    },
  })
}