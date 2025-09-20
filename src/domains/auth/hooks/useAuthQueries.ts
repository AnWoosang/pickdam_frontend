'use client';

import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '../api/authApi';
import {
  LoginForm,
} from '@/domains/auth/types/auth'
import { Role } from '@/domains/auth/types/auth';
import { queryClient } from '@/app/providers/QueryProvider';
import { authKeys } from '@/domains/auth/constants/authQueryKeys';

// 인증 상태 관리의 주요 소스 (React Query)
export const useAuth = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authApi.getCurrentUser,
    staleTime: 1000 * 60 * 10, // 10분간 fresh
    gcTime: 1000 * 60 * 60, // 1시간간 메모리에 보관
    retry: (failureCount, error: any) => {
      // 401, 403 에러는 재시도하지 않음 (토큰 만료/권한 없음)
      if (error?.status === 400 || error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    }
  })
}

// 권한 체크 유틸리티 함수들
export const useAuthUtils = () => {
  const { data: user } = useAuth();

  return {
    user,
    isAuthenticated: !!user,
    isLoading: false, // useAuth().isLoading 사용
    hasRole: (role: Role) => user?.role === role,
    isAdmin: () => user?.role === Role.ADMIN,
    isSeller: () => user?.role === Role.SELLER,
    canManageProducts: () => user?.role === Role.ADMIN || user?.role === Role.SELLER,
    canWriteNotice: () => user?.role === Role.ADMIN,
  };
};


// 로그인 Mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginForm) => authApi.loginWithEmail(data),
    onSuccess: (response) => {
      // React Query 캐시에 사용자 정보 저장
      queryClient.setQueryData(authKeys.user(), response.user)
    }
  })
}

// 로그아웃 Mutation
export const useLogout = () => {
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      console.log('Logout successful')

      // React Query 캐시 클리어
      queryClient.setQueryData(authKeys.user(), null)
      queryClient.removeQueries({ queryKey: authKeys.all })

      // 홈으로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  })
}

// 세션 새로고침 Mutation
export const useRefreshSession = () => {
  return useMutation({
    mutationFn: authApi.refreshSession,
    onSuccess: (response) => {
      // React Query 캐시에 사용자 정보 저장
      queryClient.setQueryData(authKeys.user(), response.user)
    }
  })
}