import { apiClient } from './client';
import { Product, ProductDetail } from '@/types/product';

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductSearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inhaleType?: string;
  flavor?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'popularity' | 'newest' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export const productsApi = {
  // 모든 상품 조회
  getProducts: async (params?: ProductSearchParams): Promise<ProductsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const query = searchParams.toString();
    return apiClient.get<ProductsResponse>(`/products${query ? `?${query}` : ''}`);
  },

  // 상품 상세 조회
  getProductById: async (id: string): Promise<ProductDetail> => {
    return apiClient.get<ProductDetail>(`/products/${id}`);
  },

  // 베스트셀러 상품 조회
  getBestSellers: async (limit: number = 10): Promise<Product[]> => {
    return apiClient.get<Product[]>(`/products/best-sellers?limit=${limit}`);
  },

  // 최근 인기 상품 조회
  getRecentPopular: async (limit: number = 10): Promise<Product[]> => {
    return apiClient.get<Product[]>(`/products/recent-popular?limit=${limit}`);
  },

  // 상품 검색
  searchProducts: async (params: ProductSearchParams): Promise<ProductsResponse> => {
    return productsApi.getProducts(params);
  },

  // 카테고리별 상품 조회
  getProductsByCategory: async (categoryId: string, params?: Omit<ProductSearchParams, 'category'>): Promise<ProductsResponse> => {
    return productsApi.getProducts({ ...params, category: categoryId });
  },
};