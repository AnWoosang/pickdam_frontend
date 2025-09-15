'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authStore } from '../store/authStore';

// 인증 상태 확인 및 리다이렉트 처리를 위한 커스텀 훅
export function useAuthRedirect() {
  const { isAuthenticated, isLoading } = authStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}