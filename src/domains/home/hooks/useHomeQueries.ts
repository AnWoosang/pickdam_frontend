
import { useQuery } from '@tanstack/react-query'
import { homeApi } from '../api/homeApi'
import { homeKeys } from '../constants/homeQueryKeys'

// 베스트 셀러 상품 조회
export const useBestSellerProducts = (limit: number) => {
  return useQuery({
    queryKey: homeKeys.bestSellers(limit),
    queryFn: () => homeApi.getBestSellerProducts(limit),
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 15, // 15분
    refetchOnWindowFocus: false,
  })
}

// 인기 상품 조회
export const usePopularProducts = (limit: number) => {
  return useQuery({
    queryKey: homeKeys.popularProducts(limit),
    queryFn: () => homeApi.getPopularProducts(limit),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    refetchOnWindowFocus: false,
  })
}

// 홈 데이터 통합 조회 (데이터 레이어)
export const useHomeData = (options: { bestSellersLimit: number; popularProductsLimit: number }) => {
  const bestSellers = useBestSellerProducts(options.bestSellersLimit);
  const popularProducts = usePopularProducts(options.popularProductsLimit);

  return {
    bestSellers: bestSellers.data || [],
    popularProducts: popularProducts.data || [],
    isLoading: bestSellers.isLoading || popularProducts.isLoading,
    error: bestSellers.error || popularProducts.error,
    refetch: () => {
      bestSellers.refetch();
      popularProducts.refetch();
    }
  };
}