import { apiClient } from '@/shared/api/axiosClient'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { PaginatedResponse } from '@/shared/api/types'
import { PaginationResult } from '@/shared/types/pagination'
import {
  CreateReviewRequestDto,
  UpdateReviewRequestDto
} from '@/domains/review/types/dto/reviewRequestDto';
import {
  ReviewResponseDto
} from '@/domains/review/types/dto/reviewResponseDto';
import {
  Review
} from '@/domains/review/types/review';
import {
  toReview
} from '@/domains/review/types/dto/reviewMapper';

export const reviewApi = {
  // 상품 리뷰 페이지네이션 조회
  async getProductReviews(productId: string, page: number, limit: number): Promise<PaginationResult<Review>> {
    const response = await apiClient.get<PaginatedResponse<ReviewResponseDto>>(
      `${API_ROUTES.PRODUCTS.REVIEWS(productId)}?page=${page}&limit=${limit}`
    );
    
    // 응답 데이터 검증 및 변환
    const reviewData = Array.isArray(response?.data) ? response.data.map(toReview) : [];
    
    return {
      data: reviewData,
      pagination: response?.pagination || { 
        total: 0, 
        page, 
        limit, 
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  },

  // 리뷰 작성
  async createReview(requestDto: CreateReviewRequestDto): Promise<Review> {
    const response = await apiClient.post<ReviewResponseDto>(
      API_ROUTES.PRODUCTS.REVIEWS(requestDto.productId), 
      requestDto
    );
    
    return toReview(response);
  },

  // 리뷰 수정
  async updateReview(reviewId: string, requestDto: UpdateReviewRequestDto): Promise<Review> {
    const response = await apiClient.put<ReviewResponseDto>(
      API_ROUTES.REVIEWS.DETAIL(reviewId), 
      requestDto
    );
    
    return toReview(response);
  },

  // 리뷰 삭제
  async deleteReview(reviewId: string): Promise<void> {
    await apiClient.delete(API_ROUTES.REVIEWS.DETAIL(reviewId));
  }
}