import { apiClient } from '@/shared/api/axiosClient'
import type { Product } from '@/domains/product/types/product'
import type { HomeData } from '../types/home'
import { toProduct } from '@/domains/product/types/dto/productMapper'
import { ApiResponse } from '@/shared/api/types'
import type { ProductResponseDto } from '@/domains/product/types/dto/productResponseDto'
import { API_ROUTES } from '@/app/router/apiRoutes'

// Home API 클라이언트
export const homeApi = {
  // 베스트 셀러 상품 조회
  async getBestSellerProducts(limit: number): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<ProductResponseDto[]>>(`${API_ROUTES.PRODUCTS.BESTSELLERS}?limit=${limit}`);
    
    return response.data?.map(toProduct) || [];
  },

  // 인기 상품 조회
  async getPopularProducts(limit: number): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<ProductResponseDto[]>>(`${API_ROUTES.PRODUCTS.POPULAR}?limit=${limit}`);
    
    return response.data?.map(toProduct) || [];
  },

  // 홈 화면 전체 데이터 한번에 조회
  async getHomeData(): Promise<HomeData> {
    const [bestSellers, popularProducts] = await Promise.all([
      this.getBestSellerProducts(10),
      this.getPopularProducts(10)
    ]);

    return {
      bestSellers,
      popularProducts
    };
  }
}