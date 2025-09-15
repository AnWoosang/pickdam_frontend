'use client';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { reviewApi } from '../api/reviewApi'
import { productKeys } from '@/domains/product/constants/productQueryKeys'
import { ReviewForm, ReviewImage } from '@/domains/review/types/review';
import { CreateReviewRequestDto, UpdateReviewRequestDto } from '@/domains/review/types/dto/reviewRequestDto';

// 리뷰 목록 조회 Query (모든 리뷰 가져와서 클라이언트에서 정렬/필터링)
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: productKeys.reviews(productId),
    queryFn: async () => {
      const response = await reviewApi.getProductReviews(
        productId, 
        1, // 기본 페이지
        100 // 클라이언트 정렬/필터링용 최대 개수
      );
      return response.data;
    },
    enabled: !!productId,
  });
};

// 리뷰 생성 Mutation
export const useCreateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      productId: string;
      memberId: string;
      reviewForm: ReviewForm;
      reviewImages: ReviewImage[];
    }) => {
      // ReviewForm을 CreateReviewRequestDto로 변환 (이미지 포함)
      const reviewData: CreateReviewRequestDto = {
        productId: params.productId,
        memberId: params.memberId,
        rating: params.reviewForm.rating,
        content: params.reviewForm.content,
        sweetness: params.reviewForm.sweetness,
        menthol: params.reviewForm.menthol,
        throatHit: params.reviewForm.throatHit,
        body: params.reviewForm.body,
        freshness: params.reviewForm.freshness,
        images: params.reviewImages.map(img => ({
          image_url: img.url,
          image_order: img.order
        }))
      };
      
      return reviewApi.createReview(reviewData);
    },
    onSuccess: (_, variables) => {
      // 해당 상품의 리뷰 목록 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: productKeys.reviews(variables.productId) 
      })
      
      // 상품 상세 정보도 업데이트 (평점, 리뷰 수 등)
      queryClient.invalidateQueries({ 
        queryKey: productKeys.product(variables.productId) 
      })
    }
  })
}

// 리뷰 수정 Mutation
export const useUpdateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, updates }: { 
      reviewId: string; 
      updates: UpdateReviewRequestDto;
      productId: string;
    }) => reviewApi.updateReview(reviewId, updates),
    onSuccess: (_, { productId }) => {
      // 해당 상품의 리뷰 목록 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: productKeys.reviews(productId) 
      })
      
      // 상품 상세 정보도 업데이트
      queryClient.invalidateQueries({ 
        queryKey: productKeys.product(productId) 
      })
    }
  })
}

// 리뷰 삭제 Mutation
export const useDeleteReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string; productId: string }) => 
      reviewApi.deleteReview(reviewId),
    onSuccess: (_, { productId }) => {
      // 해당 상품의 리뷰 목록 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: productKeys.reviews(productId) 
      })
      
      // 상품 상세 정보도 업데이트 (평점, 리뷰 수 등)
      queryClient.invalidateQueries({ 
        queryKey: productKeys.product(productId) 
      })
    }
  })
}