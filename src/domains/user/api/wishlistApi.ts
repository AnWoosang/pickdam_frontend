import { apiClient } from '@/shared/api/axiosClient'
import { Product } from '@/domains/product/types/product'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { PaginationResult } from '@/shared/types/pagination'
import { PaginatedResponse, ApiResponse } from '@/shared/api/types'
import { ProductResponseDto, ToggleWishlistResponseDto } from '@/domains/product/types/dto/productResponseDto';
import { toProduct } from '@/domains/product/types/dto/productMapper';

// 찜한 상품 페이지네이션 조회
export const getWishlistProducts = async (
  memberId: string, 
  page: number, 
  limit: number
): Promise<PaginationResult<Product>> => {
  const url = `${API_ROUTES.USERS.WISHLIST(memberId)}?page=${page}&limit=${limit}`;
  const response = await apiClient.get<PaginatedResponse<ProductResponseDto>>(url);
  
  return {
    data: response?.data?.map(toProduct) || [],
    pagination: response.pagination!
  };
}

// 찜 상태 토글 (추가/제거)
export const toggleWishlist = async (userId: string, productId: string): Promise<{
  success: boolean;
  isWishlisted: boolean;
  newWishlistCount: number;
}> => {
  const response = await apiClient.post<ApiResponse<ToggleWishlistResponseDto>>(
    API_ROUTES.USERS.WISHLIST_TOGGLE(userId, productId)
  );
  
  return {
    success: response.success,
    isWishlisted: response.data?.isWishlisted || false,
    newWishlistCount: response.data?.newFavoriteCount || 0
  };
}

// 찜 목록에서 여러 상품 일괄 삭제
export const removeMultipleFromWishlist = async (userId: string, productIds: string[]): Promise<{
  success: boolean;
  deletedCount: number;
}> => {
  const response = await apiClient.delete<ApiResponse<{
    deletedCount: number;
  }>>(API_ROUTES.USERS.WISHLIST(userId), {
    data: { productIds }
  });
  
  return {
    success: response.success,
    deletedCount: response.data?.deletedCount || 0
  };
}

// 찜 상태 확인 (단일 확인 API 사용)
export const checkWishlistStatus = async (memberId: string, productId: string): Promise<boolean> => {
  const response = await apiClient.get<ApiResponse<{ isWishlisted: boolean }>>(
    API_ROUTES.USERS.WISHLIST_STATUS(memberId, productId)
  );
  
  return response.data?.isWishlisted || false;
}


