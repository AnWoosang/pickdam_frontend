'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft, Filter, X } from 'lucide-react';
import { getSearchSuggestions } from '@/constants/search-mock-data';
import { SearchSuggestion, RecentSearch } from '@/types/search';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  totalResults?: number;
  className?: string;
}

export function SearchHeader({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  totalResults,
  className = ''
}: SearchHeaderProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 검색어가 외부에서 변경될 때 input 값 동기화
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // 검색 제안 업데이트
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const newSuggestions = getSearchSuggestions(inputValue);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setFocusedIndex(-1);
  }, [inputValue]);

  // 검색 실행
  const handleSearch = (query?: string) => {
    const searchTerm = (query || inputValue).trim();
    if (searchTerm) {
      onSearchChange(searchTerm);
      setShowSuggestions(false);
      searchInputRef.current?.blur();
      
      // 최근 검색어에 추가 (로컬 스토리지)
      const recentSearches = JSON.parse(localStorage.getItem('recent-searches') || '[]');
      const newSearch = {
        id: Date.now().toString(),
        keyword: searchTerm,
        searchedAt: new Date().toISOString(),
      };
      const updatedSearches = [newSearch, ...recentSearches.filter((s: RecentSearch) => s.keyword !== searchTerm)]
        .slice(0, 10); // 최대 10개까지
      localStorage.setItem('recent-searches', JSON.stringify(updatedSearches));
    }
  };

  // 검색어 클리어
  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  // 뒤로가기
  const handleBack = () => {
    router.back();
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSearch(suggestions[focusedIndex].value);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  // 제안 클릭 처리
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.value);
  };

  // 외부 클릭 시 제안 숨기기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`bg-white border-b border-gray-200 sticky top-0 z-40 ${className}`}>
      <div className="px-8">
        <div className="flex items-center h-16">

          {/* 검색 입력 영역 */}
          <div className="flex-1 relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(inputValue.trim().length > 0)}
                placeholder="상품명, 브랜드, 맛을 검색하세요"
                className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />

              {/* 검색어 클리어 버튼 */}
              {inputValue && (
                <button
                  onClick={handleClear}
                  className="absolute inset-y-0 right-12 flex items-center px-2 text-gray-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* 검색 버튼 */}
              <button
                onClick={() => handleSearch()}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* 검색 제안 */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50 max-h-80 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.value}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full px-4 py-3 text-left border-b border-gray-100 last:border-b-0 ${
                      index === focusedIndex ? 'bg-primary-light' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Search className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {suggestion.label}
                          </div>
                          {suggestion.type !== 'keyword' && (
                            <div className="text-xs text-gray-500 capitalize">
                              {suggestion.type === 'product' && '상품'}
                              {suggestion.type === 'brand' && '브랜드'}
                              {suggestion.type === 'category' && '카테고리'}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {suggestion.count && (
                        <div className="text-xs text-gray-500">
                          {suggestion.count.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* 검색 결과 수 표시 */}
        {searchQuery && typeof totalResults !== 'undefined' && (
          <div className="pb-4">
            <p className="text-sm text-gray-600">
              &apos;<span className="font-medium text-gray-900">{searchQuery}</span>&apos; 검색 결과{' '}
              <span className="font-medium text-primary">
                {totalResults.toLocaleString()}
              </span>개
            </p>
          </div>
        )}
      </div>
    </div>
  );
}