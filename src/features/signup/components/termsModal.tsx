'use client';

import React from 'react';
import { X, FileText, Calendar } from 'lucide-react';
import { TermsContent } from '@/types/signup';
import { mockTermsContent } from '@/constants/signup-mock-data';

interface TermsModalProps {
  termsType: 'terms' | 'privacy' | 'marketing';
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  className?: string;
}

export function TermsModal({ 
  termsType, 
  isOpen, 
  onClose, 
  onAccept, 
  className = '' 
}: TermsModalProps) {
  if (!isOpen) return null;

  const termsData = mockTermsContent.find(terms => terms.id === termsType);

  if (!termsData) return null;

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="flex items-center justify-center min-h-screen p-4"
        onClick={handleOverlayClick}
      >
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75"
          aria-hidden="true"
        ></div>

        {/* Modal */}
        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform max-w-2xl w-full">
          {/* Header */}
          <div className="bg-white p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                  {termsData.title}
                </h3>
                {termsData.required && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    필수
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Last updated */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4 mr-1" />
              최종 업데이트: {new Date(termsData.lastUpdated).toLocaleDateString('ko-KR')}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-4">
            <div className="max-h-96 overflow-y-auto">
              <div className="prose prose-sm max-w-none text-gray-700">
                {termsData.content.split('\n').map((line, index) => {
                  // 마크다운 스타일 헤더 처리
                  if (line.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-4 first:mt-0">
                        {line.substring(2)}
                      </h1>
                    );
                  }
                  if (line.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-lg font-semibold text-gray-900 mt-5 mb-3">
                        {line.substring(3)}
                      </h2>
                    );
                  }
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-base font-medium text-gray-900 mt-4 mb-2">
                        {line.substring(4)}
                      </h3>
                    );
                  }
                  
                  // 목록 처리
                  if (line.trim().startsWith('- ')) {
                    return (
                      <div key={index} className="ml-4 mb-1">
                        <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2 align-middle"></span>
                        {line.trim().substring(2)}
                      </div>
                    );
                  }
                  
                  // 숫자 목록 처리
                  if (/^\d+\.\s/.test(line.trim())) {
                    return (
                      <div key={index} className="ml-4 mb-1">
                        {line.trim()}
                      </div>
                    );
                  }
                  
                  // 빈 줄
                  if (line.trim() === '') {
                    return <br key={index} />;
                  }
                  
                  // 일반 텍스트
                  return (
                    <p key={index} className="mb-2 leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 flex flex-row-reverse">
            {onAccept ? (
              <>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ml-3 w-auto transition-colors"
                >
                  동의하고 닫기
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ml-3 w-auto transition-colors"
                >
                  취소
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-auto transition-colors"
              >
                닫기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}