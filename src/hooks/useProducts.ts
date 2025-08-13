import { useQuery } from '@tanstack/react-query';
import { productsApi, ProductSearchParams } from '@/api/products';

export function useProducts(params?: ProductSearchParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
  });
}

export function useBestSellers(limit: number = 10) {
  return useQuery({
    queryKey: ['bestSellers', limit],
    queryFn: () => productsApi.getBestSellers(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useRecentPopular(limit: number = 10) {
  return useQuery({
    queryKey: ['recentPopular', limit],
    queryFn: () => productsApi.getRecentPopular(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useSearchProducts(params: ProductSearchParams) {
  return useQuery({
    queryKey: ['searchProducts', params],
    queryFn: () => productsApi.searchProducts(params),
    enabled: !!(params.query || params.category),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}