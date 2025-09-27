import { apiClient } from '@/shared/api/axiosClient'
import { Product } from '@/domains/product/types/product'
import { WishlistLikeInfo } from '@/domains/user/types/user'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { PaginationResult } from '@/shared/types/pagination'
import { PaginatedResponse, ApiResponse } from '@/shared/api/types'
import { ProductResponseDto, ToggleWishlistResponseDto } from '@/domains/product/types/dto/productDto';
import { ToggleWishlistRequestDto, RemoveMultipleWishlistRequestDto } from '@/domains/user/types/dto/userDto';
import { toProduct } from '@/domains/product/types/dto/productMapper';
import { toWishlistLikeInfo } from '@/domains/user/types/dto/userMapper';

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
export const toggleWishlist = async (userId: string, productId: string): Promise<WishlistLikeInfo> => {
  const requestDto: ToggleWishlistRequestDto = {};

  const response = await apiClient.post<ApiResponse<ToggleWishlistResponseDto>>(
    API_ROUTES.USERS.WISHLIST_TOGGLE(userId, productId),
    requestDto
  );

  return toWishlistLikeInfo(response.data!);
}

// 찜 목록에서 여러 상품 일괄 삭제
export const removeMultipleFromWishlist = async (userId: string, productIds: string[]): Promise<void> => {
  const requestDto: RemoveMultipleWishlistRequestDto = {
    productIds: productIds
  };

  await apiClient.delete(API_ROUTES.USERS.WISHLIST(userId), {
    data: requestDto
  });
}

// 찜 상태 확인 (단일 확인 API 사용)
export const checkWishlistStatus = async (memberId: string, productId: string): Promise<{ isWishlisted: boolean }> => {
  
  const response = await apiClient.get<ApiResponse<{ isWishlisted: boolean }>>(
    API_ROUTES.USERS.WISHLIST_STATUS(memberId, productId)
  );

  return response.data!;
}


