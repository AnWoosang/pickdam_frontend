'use client';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { reviewApi } from '../api/reviewApi'
import { productKeys } from '@/domains/product/constants/productQueryKeys'
import { ReviewForm, Review } from '@/domains/review/types/review';

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
      return response.data; // Review[] 배열 반환
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
    }) => {
      return reviewApi.createReview(params);
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
    mutationFn: ({ updates }: {
      updates: Review;
    }) => {
      return reviewApi.updateReview(updates);
    },
    onMutate: async ({ updates }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: productKeys.reviews(updates.productId) })

      // 이전 데이터 백업
      const previousReviews = queryClient.getQueryData<Review[]>(productKeys.reviews(updates.productId))

      return { previousReviews }
    },
    onError: (error, { updates }, context) => {
      // 에러 시 이전 데이터로 롤백
      if (context?.previousReviews) {
        queryClient.setQueryData(productKeys.reviews(updates.productId), context.previousReviews)
      }
    },
    onSuccess: (data, { updates }) => {
      // 캐시 직접 업데이트 - 서버 응답 데이터 사용
      queryClient.setQueryData<Review[]>(productKeys.reviews(updates.productId), (old) => {
        if (!old || !Array.isArray(old)) return old;

        const updatedData = old.map((review: Review) =>
          review.id === updates.id ? { ...review, ...updates } : review
        );

        return updatedData;
      });
    },
    onSettled: (_, __, { updates }) => {
      // 상품 상세 정보만 업데이트 (평점, 리뷰 수 등)
      queryClient.invalidateQueries({
        queryKey: productKeys.product(updates.productId)
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