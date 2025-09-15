'use client';

import React from 'react';
import { ErrorPage } from '@/shared/components/ErrorPage';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // 로깅 (실제 환경에서는 로깅 서비스로 전송)
  React.useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-white">
          <ErrorPage 
            statusCode={500}
            title="심각한 오류가 발생했습니다"
            message="애플리케이션에 예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요."
            showBackButton={false}
            showHomeButton={true}
            showRefreshButton={true}
          />
          
          {/* 개발 모드에서만 상세 오류 정보 표시 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 right-4 max-w-md p-4 bg-red-100 border border-red-300 rounded-lg">
              <h3 className="font-medium text-red-800 mb-2">개발 모드 오류 정보:</h3>
              <p className="text-sm text-red-700 mb-2">{error.message}</p>
              <button
                onClick={reset}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
              >
                다시 시도
              </button>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}