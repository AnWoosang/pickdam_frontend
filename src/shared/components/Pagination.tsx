'use client';

import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: number; // 표시할 페이지 번호 개수 (기본값: 5)
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showPageNumbers = 5 
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // 표시할 페이지 번호 범위 계산
  const getVisiblePages = () => {
    const half = Math.floor(showPageNumbers / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + showPageNumbers - 1);
    
    // 끝에서 부족한 만큼 앞으로 조정
    if (end - start < showPageNumbers - 1) {
      start = Math.max(1, end - showPageNumbers + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showFirstPage = visiblePages[0] > 1;
  const showLastPage = visiblePages[visiblePages.length - 1] < totalPages;
  const showPrevEllipsis = visiblePages[0] > 2;
  const showNextEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const buttonBaseClass = "px-3 py-2 text-sm font-medium border transition-colors duration-200 cursor-pointer";
  const activeClass = "bg-primary text-white border-primary";
  const inactiveClass = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
  const disabledClass = "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed";

  return (
    <div className="flex items-center justify-center space-x-1 mt-8">
      {/* 이전 버튼 */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonBaseClass} rounded-l-md ${
          currentPage === 1 ? disabledClass : inactiveClass
        }`}
      >
        이전
      </button>

      {/* 첫 번째 페이지 */}
      {showFirstPage && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            className={`${buttonBaseClass} ${inactiveClass}`}
          >
            1
          </button>
          {showPrevEllipsis && (
            <span className="px-3 py-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* 페이지 번호들 */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`${buttonBaseClass} ${
            page === currentPage ? activeClass : inactiveClass
          }`}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지 */}
      {showLastPage && (
        <>
          {showNextEllipsis && (
            <span className="px-3 py-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => handlePageClick(totalPages)}
            className={`${buttonBaseClass} ${inactiveClass}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 버튼 */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${buttonBaseClass} rounded-r-md ${
          currentPage === totalPages ? disabledClass : inactiveClass
        }`}
      >
        다음
      </button>
    </div>
  );
}