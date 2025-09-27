import { apiClient } from '@/shared/api/axiosClient'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { PaginatedResponse, ApiResponse } from '@/shared/api/types'
import { PaginationResult } from '@/shared/types/pagination'
import {
  CreateReviewRequestDto,
  ReviewResponseDto
} from '@/domains/review/types/dto/reviewDto';
import {
  Review,
  ReviewForm
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
  async createReview(params: {
    productId: string;
    memberId: string;
    reviewForm: ReviewForm;
  }): Promise<Review> {

    // ReviewForm을 CreateReviewRequestDto로 변환
    const requestDto: CreateReviewRequestDto = {
      productId: params.productId,
      memberId: params.memberId,
      content: params.reviewForm.content,
      rating: params.reviewForm.rating,
      sweetness: params.reviewForm.sweetness,
      menthol: params.reviewForm.menthol,
      throatHit: params.reviewForm.throatHit,
      body: params.reviewForm.body,
      freshness: params.reviewForm.freshness,
      images: params.reviewForm.uploadedImageUrls.map((imageUrl, imageOrder) => ({
        imageUrl: imageUrl,
        imageOrder: imageOrder + 1
      }))
    };



    const response = await apiClient.post<ApiResponse<ReviewResponseDto>>(
      API_ROUTES.PRODUCTS.REVIEWS(params.productId),
      requestDto
    );

    return toReview(response.data!);
  },

  // 리뷰 수정
  async updateReview(review: Review): Promise<Review> {
    // Review를 CreateReviewRequestDto로 변환
    const requestDto: CreateReviewRequestDto = {
      productId: review.productId,
      memberId: review.memberId,
      content: review.content,
      rating: review.rating,
      sweetness: review.sweetness,
      menthol: review.menthol,
      throatHit: review.throatHit,
      body: review.body,
      freshness: review.freshness,
      images: review.images.map((img) => ({
        imageUrl: img.imageUrl,
        imageOrder: img.imageOrder
      }))
    };

    const response = await apiClient.put<ApiResponse<ReviewResponseDto>>(
      API_ROUTES.REVIEWS.DETAIL(review.id),
      requestDto
    );

    return toReview(response.data!);
  },

  // 리뷰 삭제
  async deleteReview(reviewId: string): Promise<void> {
    await apiClient.delete(API_ROUTES.REVIEWS.DETAIL(reviewId));
  }
}