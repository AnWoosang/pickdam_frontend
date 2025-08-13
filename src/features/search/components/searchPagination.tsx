'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SearchPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: SearchPaginationProps) {
  // 표시할 페이지 번호들 계산
  const getPageNumbers = () => {
    const maxButtons = 7;
    const halfButtons = Math.floor(maxButtons / 2);
    
    let startPage = Math.max(0, currentPage - halfButtons);
    const endPage = Math.min(totalPages - 1, startPage + maxButtons - 1);
    
    // 끝에서부터 역산하여 시작 페이지 조정
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(0, endPage - maxButtons + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();
  const hasPrevious = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 disabled:opacity-50"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* 첫 페이지 (생략 표시와 함께) */}
      {pageNumbers[0] > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700"
          >
            1
          </button>
          {pageNumbers[0] > 1 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* 페이지 번호들 */}
      {pageNumbers.map(pageIndex => (
        <button
          key={pageIndex}
          onClick={() => onPageChange(pageIndex)}
          className={`px-3 py-2 rounded-lg border ${
            pageIndex === currentPage
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300 bg-white text-gray-700'
          }`}
        >
          {pageIndex + 1}
        </button>
      ))}

      {/* 마지막 페이지 (생략 표시와 함께) */}
      {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 disabled:opacity-50"
        aria-label="다음 페이지"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}