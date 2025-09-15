'use client';

import React from 'react';

import { BaseModal } from '@/shared/components/BaseModal';
import { TermsContent } from '@/shared/constants/terms';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  terms: TermsContent;
}

export function TermsModal({ isOpen, onClose, terms }: TermsModalProps) {

  // 마크다운 스타일 텍스트를 HTML로 변환하는 간단한 함수
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // 제목 처리 (## 으로 시작하는 라인)
        if (line.startsWith('## ')) {
          return (
            <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
              {line.replace('## ', '')}
            </h3>
          );
        }
        
        // 소제목 처리 (### 으로 시작하는 라인)
        if (line.startsWith('### ')) {
          return (
            <h4 key={index} className="text-base font-medium text-gray-800 mt-4 mb-2">
              {line.replace('### ', '')}
            </h4>
          );
        }

        // 리스트 처리 (- 으로 시작하는 라인)
        if (line.trim().startsWith('- ')) {
          return (
            <li key={index} className="text-gray-700 mb-1">
              {line.replace(/^\s*- /, '')}
            </li>
          );
        }

        // 빈 라인
        if (line.trim() === '') {
          return <br key={index} />;
        }

        // 일반 텍스트
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-2">
            {line}
          </p>
        );
      });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={terms.title}
      size="large"
      preventBodyScroll={true}
      className="flex flex-col"
      footer={
        <div className="p-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            확인
          </button>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose max-w-none">
          {formatContent(terms.content)}
        </div>
        
        {/* 최종 업데이트 일자 */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            최종 업데이트: {terms.lastUpdated}
          </p>
        </div>
      </div>
    </BaseModal>
  );
}