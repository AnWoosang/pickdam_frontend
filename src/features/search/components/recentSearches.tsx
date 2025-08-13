'use client';

import React, { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import { RecentSearch } from '@/types/search';

interface RecentSearchesProps {
  onSearchClick: (query: string) => void;
  className?: string;
}

export function RecentSearches({ onSearchClick, className = '' }: RecentSearchesProps) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // 로컬 스토리지에서 최근 검색어 로드
  useEffect(() => {
    const loadRecentSearches = () => {
      try {
        const stored = localStorage.getItem('recent-searches');
        if (stored) {
          const searches = JSON.parse(stored);
          setRecentSearches(searches);
        }
      } catch (error) {
        console.error('최근 검색어 로드 실패:', error);
      }
    };

    loadRecentSearches();

    // 스토리지 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'recent-searches') {
        loadRecentSearches();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 개별 검색어 삭제
  const removeSearch = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updated = recentSearches.filter(search => search.id !== id);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  // 전체 검색어 삭제
  const clearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  // 시간 포맷팅
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-400" />
          최근 검색어
        </h2>
        <button
          onClick={clearAllSearches}
          className="text-sm text-gray-500"
        >
          전체 삭제
        </button>
      </div>

      <div className="space-y-2">
        {recentSearches.map(search => (
          <div
            key={search.id}
            className="flex items-center justify-between p-3 rounded-lg group"
            onClick={() => onSearchClick(search.keyword)}
          >
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {search.keyword}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTimeAgo(search.searchedAt)}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => removeSearch(search.id, e)}
              className="p-1 text-gray-400"
              aria-label="검색어 삭제"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 최근 검색어는 최대 10개까지 저장되며, 로컬에서만 관리됩니다.
        </p>
      </div>
    </div>
  );
}