'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/domains/user/api/userApi'
import { mypageApi } from '@/domains/user/api/mypageApi'
import { getWishlistProducts } from '@/domains/user/api/wishlistApi'
import { UpdateProfileForm, WithdrawMemberForm } from '@/domains/user/types/user'
import { myPageKeys } from '@/domains/user/constants/userQueryKeys'

// 사용자 찜목록 조회 (마이페이지용)
export const useMyPageWishlistQuery = (userId: string, page: number, limit: number) => {
  return useQuery({
    queryKey: myPageKeys.wishlist(userId),
    queryFn: () => getWishlistProducts(userId, page, limit),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
  })
}

// 사용자 리뷰 조회 (페이지네이션 지원)
export const useUserReviews = (userId: string, page: number, limit: number) => {
  return useQuery({
    queryKey: [...myPageKeys.reviews(userId), 'paginated', page, limit],
    queryFn: () => mypageApi.getUserReviews(userId, page, limit),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10분
  })
}

// 사용자 통계 조회
export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: myPageKeys.stats(userId),
    queryFn: () => mypageApi.getUserStats(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 15, // 15분
  })
}

// 내가 쓴 댓글 조회
export const useMyComments = (userId: string, page: number, limit: number) => {
  return useQuery({
    queryKey: myPageKeys.myComments(userId, page, limit),
    queryFn: () => mypageApi.getMyComments(userId, page, limit),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2분
  })
}

// 내가 쓴 게시글 조회
export const useMyPosts = (userId: string, page: number, limit: number) => {
  return useQuery({
    queryKey: myPageKeys.myPosts(userId, page, limit),
    queryFn: () => mypageApi.getMyPosts(userId, page, limit),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2분
  })
}

// 프로필 업데이트 Mutation  
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, updates }: { 
      userId: string; 
      updates: UpdateProfileForm 
    }) => userApi.updateProfile(userId, updates),
    onSuccess: (_, { userId }) => {
      // 사용자 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: myPageKeys.stats(userId) })
    }
  })
}

// 회원탈퇴 Mutation
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ memberId, requestForm }: { memberId: string; requestForm: WithdrawMemberForm }) =>
      userApi.withdrawMember(memberId, requestForm),
    onSuccess: () => {
      // 모든 마이페이지 관련 캐시 삭제
      queryClient.removeQueries({ queryKey: myPageKeys.all })
      // 전역 상태도 초기화 (인증 상태 등)
      queryClient.removeQueries({ queryKey: ['auth'] })
    }
  })
}