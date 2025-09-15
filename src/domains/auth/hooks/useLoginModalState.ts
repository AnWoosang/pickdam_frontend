"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/domains/auth/store/authStore';

export function useLoginModalState() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  // URL 파라미터에서 login=true 감지하여 로그인 모달 자동 열기
  useEffect(() => {
    const shouldOpenLogin = searchParams.get('login');
    if (shouldOpenLogin === 'true' && !isAuthenticated) {
      setIsLoginModalOpen(true);
      
      // URL에서 login 파라미터 제거 (SSR 안전성 체크)
      if (typeof window !== 'undefined') {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('login');
        window.history.replaceState({}, '', newUrl.pathname + newUrl.search);
      }
    }
  }, [searchParams, isAuthenticated]);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  return {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal
  };
}