'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { mockTermsContent } from '@/constants/signup-mock-data';

export default function PrivacyPage() {
  const privacyData = mockTermsContent.find(terms => terms.id === 'privacy');

  if (!privacyData) {
    return <div>개인정보 처리방침을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link 
            href="/signup" 
            className="inline-flex items-center text-primary hover:text-primary-dark mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            회원가입으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{privacyData.title}</h1>
          <p className="text-gray-600 mt-2">
            최종 업데이트: {new Date(privacyData.lastUpdated).toLocaleDateString('ko-KR')}
          </p>
        </div>

        {/* 내용 */}
        <div className="prose prose-lg max-w-none">
          {privacyData.content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return (
                <h1 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
                  {line.substring(2)}
                </h1>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <h2 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  {line.substring(3)}
                </h2>
              );
            }
            if (line.startsWith('### ')) {
              return (
                <h3 key={index} className="text-lg font-medium text-gray-900 mt-5 mb-2">
                  {line.substring(4)}
                </h3>
              );
            }
            
            if (line.trim().startsWith('- ')) {
              return (
                <div key={index} className="ml-4 mb-2">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mr-3 align-middle"></span>
                  {line.trim().substring(2)}
                </div>
              );
            }
            
            if (/^\d+\.\s/.test(line.trim())) {
              return (
                <div key={index} className="ml-4 mb-2">
                  {line.trim()}
                </div>
              );
            }
            
            if (line.trim() === '') {
              return <br key={index} />;
            }
            
            return (
              <p key={index} className="mb-4 leading-relaxed text-gray-700">
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}