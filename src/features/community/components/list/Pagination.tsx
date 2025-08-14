'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  // 이전 버튼
  if (currentPage > 1) {
    pages.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
      >
        이전
      </button>
    );
  }

  // 첫 페이지
  if (startPage > 1) {
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
      >
        1
      </button>
    );
    if (startPage > 2) {
      pages.push(<span key="ellipsis1" className="px-2 text-gray-500">...</span>);
    }
  }

  // 페이지 번호들
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`px-3 py-2 rounded-md text-sm ${
          i === currentPage
            ? 'bg-primary text-white'
            : 'border border-gray-300 hover:bg-gray-50'
        }`}
      >
        {i}
      </button>
    );
  }

  // 마지막 페이지
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(<span key="ellipsis2" className="px-2 text-gray-500">...</span>);
    }
    pages.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
      >
        {totalPages}
      </button>
    );
  }

  // 다음 버튼
  if (currentPage < totalPages) {
    pages.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
      >
        다음
      </button>
    );
  }

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center gap-2">
        {pages}
      </div>
    </div>
  );
};