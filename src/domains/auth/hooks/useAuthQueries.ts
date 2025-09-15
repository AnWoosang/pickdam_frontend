'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '../api/authApi';
import {
  LoginFormData,
} from '@/domains/auth/types/auth'

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

// 현재 사용자 정보 조회
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authApi.getCurrentUser,
    retry: (failureCount, error) => {
      // 401 에러는 재시도하지 않음 (인증 실패)
      if ((error as { response?: { status?: number } })?.response?.status === 401) {
        return false;
      }
      // 다른 에러는 최대 2번까지 재시도
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true, // 네트워크 재연결 시 새로고침
    staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지
    gcTime: 1000 * 60 * 30, // 30분간 메모리에 보관 (사용하지 않아도)
  })
}


// 로그인 Mutation
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.loginWithEmail(data),
    onSuccess: (response) => {
      // 사용자 정보를 캐시에 저장
      queryClient.setQueryData(authKeys.user(), response.user)
      
      // 모든 auth 관련 쿼리를 무효화하여 다시 fetch
      queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
    onError: (error) => {
      // 로그인 실패 로깅 (모든 에러는 이미 백엔드에서 사용자 친화적으로 변환됨)
      console.log('useLogin Mutation failed:', error.message)
    }
  })
}

// 로그아웃 Mutation
export const useLogout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      console.log('Logout successful, clearing cache and redirecting')
      
      // 모든 인증 관련 캐시 삭제
      queryClient.removeQueries({ queryKey: authKeys.all })
      
      // 홈으로 리다이렉트
      router.push('/')
    },
    onSettled: () => {
      // 성공/실패 관계없이 캐시 초기화
      queryClient.removeQueries({ queryKey: authKeys.all })
    }
  })
}

// 세션 새로고침 Mutation
export const useRefreshSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.refreshSession,
    onSuccess: (response) => {
      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(authKeys.user(), response.user)
    },
    onError: (error) => {
      console.error('Session refresh failed:', error)
      // 세션 새로고침 실패 시 캐시 삭제
      queryClient.removeQueries({ queryKey: authKeys.all })
    }
  })
}