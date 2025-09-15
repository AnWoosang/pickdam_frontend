'use client';

import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { Pagination } from '@/shared/components/Pagination';
import { Button } from '@/shared/components/Button';

export interface MypageLayoutProps {
  title: string;
  totalCount?: number;
  isLoading?: boolean;
  error?: Error | null;
  children: React.ReactNode;
  
  // 페이지네이션 props (선택사항)
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  
  // 추가 액션 버튼들 (선택사항)
  actions?: React.ReactNode;
}

export const MypageLayout = memo<MypageLayoutProps>(function MypageLayout({
  title,
  totalCount,
  isLoading = false,
  error = null,
  children,
  currentPage,
  totalPages,
  onPageChange,
  actions
}) {
  const router = useRouter();
  
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div>
          <ErrorMessage message={`${title}을 불러오는데 실패했습니다.`} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div>
        {/* 공통 헤더 */}
        <div className="flex items-center justify-between gap-4 py-2 bg-white mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              size="medium"
              icon={<ArrowLeft className="w-5 h-5" />}
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {totalCount !== undefined && (
                <p className="text-gray-600 mt-1">총 {totalCount.toLocaleString()}개</p>
              )}
            </div>
          </div>
          
          {/* 추가 액션 버튼들 */}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>

        {/* 컨텐츠 */}
        <div className="space-y-4">
          {children}
        </div>

        {/* 페이지네이션 */}
        {currentPage && totalPages && onPageChange && totalPages > 1 && (
          <div className="mt-8 pb-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
});