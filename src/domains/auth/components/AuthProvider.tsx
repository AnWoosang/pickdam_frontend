'use client';

import React, { useEffect, ReactNode } from 'react';
import { useCurrentUser } from '../hooks/useAuthQueries';
import { LoginModal } from '@/domains/auth/components/LoginModal';
import { useAuthStore } from '../store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // React Query hooks
  const userQuery = useCurrentUser();
  
  // Zustand store에서 상태 가져오기
  const { isLoginModalOpen, closeLoginModal, setUser, setLoading, setError } = useAuthStore();

  // React Query 상태를 authStore에 동기화
  useEffect(() => {
    setUser(userQuery.data || null);
  }, [userQuery.data, setUser]);

  useEffect(() => {
    setLoading(userQuery.isLoading);
  }, [userQuery.isLoading, setLoading]);

  useEffect(() => {
    setError(userQuery.error?.message || null);
  }, [userQuery.error?.message, setError]);

  return (
    <>
      {children}
      {/* 전역 로그인 모달 */}
      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
        />
      )}
    </>
  );
}