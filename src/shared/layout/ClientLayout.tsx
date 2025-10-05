'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from "@/app/providers/QueryProvider";
import { LoginModal } from '@/domains/auth/components/LoginModal';
import { useUIStore } from '@/domains/auth/store/authStore';
import ErrorBoundary from '@/shared/error/ErrorBoundary';
import { loadPopunderScript } from '@/shared/utils/popunderAd';

// 프로덕션 환경에서만 Sentry 초기화
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  import('@/infrastructure/monitoring/sentry').then(({ initSentry }) => {
    initSentry();
  });
}

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { isLoginModalOpen, closeLoginModal } = useUIStore();

  // 팝언더 광고 스크립트 로드 (한 번만 실행)
  // useEffect(() => {
    // loadPopunderScript();
  // }, []);

  return (
    <ErrorBoundary>
      <QueryProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
        {/* 전역 로그인 모달 */}
        {isLoginModalOpen && (
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={closeLoginModal}
          />
        )}
      </QueryProvider>
    </ErrorBoundary>
  );
}