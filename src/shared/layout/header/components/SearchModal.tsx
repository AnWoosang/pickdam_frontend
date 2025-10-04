"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search } from 'lucide-react';
import { ROUTES } from '@/app/router/routes';
import { Button } from '@/shared/components/Button';
import { SearchBar } from '@/shared/components/SearchBar';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // localStorage에서 최근 검색어 불러오기
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch {
          setRecentSearches([]);
        }
      }
    }
  }, [isOpen]);

  // 최근 검색어 저장
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;

    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 10);

    setRecentSearches(updatedSearches);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    saveRecentSearch(query.trim());
    router.push(`${ROUTES.PRODUCT.LIST}?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const handleRecentSearchClick = (query: string) => {
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
  };

  const removeRecentSearch = (query: string) => {
    const updated = recentSearches.filter(item => item !== query);
    setRecentSearches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white md:hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* 검색바 */}
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="상품을 검색하세요..."
            showRecentSearches={false}
            className="w-full"
          />
        </div>
      </div>

      {/* 최근 검색어 */}
      <div className="p-4">
        {recentSearches.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">최근 검색어</h3>
              <Button
                onClick={clearRecentSearches}
                variant="ghost"
                size="small"
                className="!text-xs !text-gray-500 hover:!text-gray-700 !p-1"
              >
                전체삭제
              </Button>
            </div>
            <div className="space-y-2">
              {recentSearches.slice(0, 10).map((query, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Button
                    onClick={() => handleRecentSearchClick(query)}
                    variant="ghost"
                    size="small"
                    className="!flex-1 !text-left !text-sm !text-gray-700 !p-0 !justify-start hover:!bg-transparent"
                  >
                    {query}
                  </Button>
                  <Button
                    onClick={() => removeRecentSearch(query)}
                    variant="ghost"
                    size="small"
                    icon={<X className="w-4 h-4" />}
                    className="!p-1 !text-gray-400 hover:!text-gray-600"
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">최근 검색어가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};
