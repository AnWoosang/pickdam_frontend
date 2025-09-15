import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import {getWishlistProducts, toggleWishlist, checkWishlistStatus } from '@/domains/user/api/wishlistApi'
import { wishlistKeys } from '@/domains/user/constants/userQueryKeys'

// 페이지네이션된 찜 목록 조회
export const useWishlistQuery = (memberId?: string, page = 1, limit = 20, enabled = true) => {
  const query = useQuery({
    queryKey: wishlistKeys.byUserPaginated(memberId || '', page, limit),
    queryFn: () => getWishlistProducts(memberId!, page, limit),
    enabled: !!memberId && enabled,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return query;
}

// 개별 찜 상태 확인
export const useWishlistStatusQuery = (memberId?: string, productId?: string) => {
  return useQuery({
    queryKey: wishlistKeys.status(memberId || '', productId || ''),
    queryFn: () => checkWishlistStatus(memberId!, productId!),
    enabled: !!memberId && !!productId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}

export const useWishlistMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ memberId, productId }: { memberId: string; productId: string }) => 
      toggleWishlist(memberId, productId),
    onSuccess: () => {
      // 모든 찜 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.all
      });
    }
  })
}