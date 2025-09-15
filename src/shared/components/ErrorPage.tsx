'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/router/routes';

export interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
}

export function ErrorPage({ 
  statusCode = 500,
  title,
  message,
  showBackButton = true,
  showHomeButton = true,
  showRefreshButton = false
}: ErrorPageProps) {
  const router = useRouter();

  const getDefaultContent = () => {
    switch (statusCode) {
      case 404:
        return {
          title: '페이지를 찾을 수 없습니다',
          message: '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.',
          icon: (
            <svg className="w-16 h-16 text-hintText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        };
      case 500:
        return {
          title: '서버 오류가 발생했습니다',
          message: '일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          icon: (
            <svg className="w-16 h-16 text-hintText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        };
      default:
        return {
          title: '오류가 발생했습니다',
          message: '예상치 못한 오류가 발생했습니다.',
          icon: (
            <svg className="w-16 h-16 text-hintText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayTitle = title || defaultContent.title;
  const displayMessage = message || defaultContent.message;

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(ROUTES.HOME);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16">
      <div className="text-center max-w-md mx-auto">
        {/* 상태 코드 */}
        {statusCode && (
          <div className="text-6xl font-bold text-hintText mb-4">
            {statusCode}
          </div>
        )}

        {/* 아이콘 */}
        <div className="mb-6">
          {defaultContent.icon}
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-textHeading mb-4">
          {displayTitle}
        </h1>

        {/* 메시지 */}
        <p className="text-textDefault mb-8">
          {displayMessage}
        </p>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              이전 페이지로
            </button>
          )}

          {showHomeButton && (
            <Link 
              href={ROUTES.HOME} 
              className="inline-flex items-center gap-2 bg-grayLighter text-textDefault px-6 py-3 rounded-lg font-medium hover:bg-grayLight transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              홈으로 가기
            </Link>
          )}

          {showRefreshButton && (
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-grayLighter text-textDefault px-6 py-3 rounded-lg font-medium hover:bg-grayLight transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              새로고침
            </button>
          )}
        </div>
      </div>
    </div>
  );
}