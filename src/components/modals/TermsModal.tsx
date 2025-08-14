'use client';

import React from 'react';
import { X } from 'lucide-react';
import { TermsContent } from '@/constants/terms';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  terms: TermsContent;
}

export function TermsModal({ isOpen, onClose, terms }: TermsModalProps) {
  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{terms.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 내용 */}
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

        {/* 푸터 */}
        <div className="p-6 border-t border-gray-200 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}