'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/router/routes';

export interface ComingSoonProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function ComingSoon({ title, description, icon }: ComingSoonProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16">
      <div className="text-center max-w-md mx-auto">
        {/* 아이콘 */}
        <div className="mb-8">
          {icon || (
            <div className="w-24 h-24 mx-auto bg-grayLighter rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-hintText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* 제목 */}
        <h1 className="text-3xl font-bold text-textHeading mb-4">
          {title}
        </h1>

        {/* 설명 */}
        <p className="text-lg text-textDefault mb-2">
          준비중입니다
        </p>
        
        {description && (
          <p className="text-textDefault mb-8">
            {description}
          </p>
        )}

        {/* 안내 메시지 */}
        <div className="bg-grayLighter rounded-lg p-6 mb-8">
          <p className="text-textDefault text-sm leading-relaxed">
            더 나은 서비스를 제공하기 위해 열심히 개발 중입니다.<br />
            빠른 시일 내에 만나뵐 수 있도록 하겠습니다.
          </p>
        </div>

        {/* 홈으로 돌아가기 버튼 */}
        <Link 
          href={ROUTES.HOME} 
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}