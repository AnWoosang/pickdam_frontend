'use client';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { reviewApi } from '../api/reviewApi'
import { reviewKeys } from '@/domains/review/constants/reviewQueryKeys'
import { ReviewForm, Review } from '@/domains/review/types/review';

// 리뷰 목록 조회 Query (모든 리뷰 가져와서 클라이언트에서 정렬/필터링)
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: reviewKeys.reviews(productId),
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
    onSuccess: (newReview, variables) => {
      // 성공 시 캐시에 새 리뷰 직접 추가 (중복 방지)
      queryClient.setQueryData<Review[]>(reviewKeys.reviews(variables.productId), (old) => {
        if (!old || !Array.isArray(old)) return [newReview];

        // 이미 같은 ID의 리뷰가 있는지 확인
        const existingIndex = old.findIndex(review => review.id === newReview.id);
        if (existingIndex !== -1) {
          // 이미 있으면 기존 것을 새 데이터로 교체
          const updated = [...old];
          updated[existingIndex] = newReview;
          return updated;
        }
        // 없으면 맨 위에 추가
        return [newReview, ...old];
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
    onSuccess: (updatedReview, { updates }) => {
      // 성공 시 캐시에서 해당 리뷰 업데이트
      queryClient.setQueryData<Review[]>(reviewKeys.reviews(updates.productId), (old) => {
        if (!old || !Array.isArray(old)) return old;

        return old.map((review: Review) =>
          review.id === updatedReview.id ? updatedReview : review
        );
      });
    }
  })
}

// 리뷰 삭제 Mutation
export const useDeleteReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string; productId: string }) =>
      reviewApi.deleteReview(reviewId),
    onSuccess: (_, { reviewId, productId }) => {
      // 성공 시 캐시에서 해당 리뷰 제거
      queryClient.setQueryData<Review[]>(reviewKeys.reviews(productId), (old) => {
        if (!old || !Array.isArray(old)) return old;
        return old.filter(review => review.id !== reviewId);
      })
    }
  })
}