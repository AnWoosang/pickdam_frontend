'use client';

import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '../api/authApi';
import {
  LoginForm,
  FindPasswordForm,
  ResetPasswordForm,
} from '@/domains/auth/types/auth'
import { Role } from '@/domains/auth/types/auth';
import { User } from '@/domains/user/types/user';
import { queryClient } from '@/app/providers/QueryProvider';
import { authKeys } from '@/domains/auth/constants/authQueryKeys';
import { BusinessError } from '@/shared/error/BusinessError';
import { isProtectedRoute } from '@/app/router/auth-config';

// 인증 상태 관리의 주요 소스 (React Query)
export const useAuth = () => {
  const query = useQuery<User | null>({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        return await authApi.getCurrentUser();
      } catch (error) {
        // 비보호 라우트에서는 인증 에러를 null로 처리
        if (error instanceof BusinessError &&
            typeof window !== 'undefined' &&
            !isProtectedRoute(window.location.pathname)) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 30, // 5분간 fresh 유지
    gcTime: 1000 * 60 * 45,
    retry: false, // 재시도 완전 비활성화
  });

  return query;
}

// 권한 체크 유틸리티 함수들
export const useAuthUtils = () => {
  const { data: user, isLoading, error } = useAuth();

  return {
    user: user as User | null,
    isAuthenticated: !!user,
    isLoading,
    error,
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
    onSuccess: (sessionInfo) => {
      // 캐시에 사용자 정보 저장
      queryClient.setQueryData(authKeys.user(), sessionInfo.user);

      // 현재 페이지로 리다이렉트 (새로고침으로 동기화 문제 해결)
      if (typeof window !== 'undefined') {
        window.location.href = window.location.pathname + window.location.search;
      }
    }
  })
}

// 로그아웃 Mutation
export const useLogout = () => {
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });

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
    onSuccess: (sessionInfo) => {
      // React Query 캐시에 사용자 정보 저장
      queryClient.setQueryData(authKeys.user(), sessionInfo.user);
    }
  })
}

// 비밀번호 찾기 Mutation
export const useFindPassword = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: (data: FindPasswordForm) => authApi.findPassword(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

// 비밀번호 재설정 Mutation
export const useResetPassword = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: (data: ResetPasswordForm) => authApi.resetPassword(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}