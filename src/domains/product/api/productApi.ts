import { apiClient } from '@/shared/api/axiosClient'
import type { PaginatedResponse, ApiResponse } from '@/shared/api/types'
import type { PaginationResult } from '@/shared/types/pagination'
import type { Product, ProductDetail } from '@/domains/product/types/product'
import {
  toProduct,
  toProductDetail
} from '@/domains/product/types/dto/productMapper';
import {
  ProductsRequestParamDto
} from '@/domains/product/types/dto/productRequestDto';
import {
  ProductResponseDto,
  ProductDetailResponseDto,
  IncrementViewResponseDto
} from '@/domains/product/types/dto/productResponseDto';

import { API_ROUTES } from '@/app/router/apiRoutes'


export const productApi = {
  // 상품 목록 조회 (필터링 및 정렬 포함)
  async getProducts(params: ProductsRequestParamDto = {}): Promise<PaginationResult<Product>> {
    // API 파라미터 매핑
    const apiParams = {
      page: params.page,
      limit: params.limit,
      category: params.category,
      categories: params.categories ? params.categories.join(',') : undefined,
      inhaleType: params.inhaleType,
      brand: params.brand,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      search: params.search,
      sortBy: params.sortBy || 'total_views',
      sortOrder: params.sortBy === 'created_at' ? 'desc' : params.sortOrder || 'asc'
    }

    const searchParams = new URLSearchParams()
    Object.entries(apiParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    const query = searchParams.toString()
    const response = await apiClient.get<PaginatedResponse<ProductResponseDto>>(`${API_ROUTES.PRODUCTS.LIST}${query ? `?${query}` : ''}`)
    
    return {
      data: response?.data?.map(toProduct) || [],
      pagination: response.pagination!
    }
  },

  // 상품 상세 조회
  async getProductDetail(productId: string): Promise<ProductDetail> {
    const response = await apiClient.get<ApiResponse<ProductDetailResponseDto>>(API_ROUTES.PRODUCTS.DETAIL(productId))
    
    return toProductDetail(response.data!.product, response.data!.sellers, response.data!.averageReviewInfo, response.data!.priceHistory)
  },

  // 상품 조회수 증가 (간소화)
  async incrementProductViews(productId: string): Promise<number> {
    const response = await apiClient.post<IncrementViewResponseDto>(API_ROUTES.PRODUCTS.VIEW(productId), {});
    return response.newViewCount;
  }
}