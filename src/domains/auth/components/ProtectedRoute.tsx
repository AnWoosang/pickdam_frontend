'use client';

import React, { ReactNode } from 'react';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

// 인증된 사용자만 접근 가능한 페이지용 컴포넌트
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthRedirect();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}