import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from '@/domains/auth/components/AuthProvider';
import ErrorBoundary from '@/shared/error/ErrorBoundary';
import "./globals.css";

// 프로덕션 환경에서만 Sentry 초기화
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  import('@/infrastructure/monitoring/sentry').then(({ initSentry }) => {
    initSentry();
  });
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Pickdam - 전자담배 가격 비교",
  description: "다양한 전자담배 제품의 가격을 비교하고 최저가를 찾아보세요"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className="font-pretendard antialiased"
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
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
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
