'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

export type SearchFilterType = 'title' | 'titleContent' | 'author';

export interface SearchBarProps {
  searchQuery?: string;
  searchFilter?: SearchFilterType;
  onSearch: (query: string, filter?: SearchFilterType) => void;
  placeholder?: string;
  showFilter?: boolean;
  className?: string;
  initialValue?: string;
  showRecentSearches?: boolean;
  mobileFullScreen?: boolean;
}

const filterOptions: { value: SearchFilterType; label: string }[] = [
  { value: 'title', label: '제목' },
  { value: 'titleContent', label: '제목+내용' },
  { value: 'author', label: '작성자' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery = '',
  searchFilter = 'title',
  onSearch,
  placeholder = '검색어를 입력하세요...',
  showFilter = false,
  className = '',
  initialValue = '',
  showRecentSearches = false,
  mobileFullScreen = false,
}) => {
  const [inputValue, setInputValue] = useState(initialValue || searchQuery);
  const [currentFilter, setCurrentFilter] = useState<SearchFilterType>(searchFilter);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // localStorage에서 최근 검색어 불러오기
  useEffect(() => {
    if (showRecentSearches && typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch {
          setRecentSearches([]);
        }
      }
    }
  }, [showRecentSearches]);

  // 최근 검색어 저장
  const saveRecentSearch = (query: string) => {
    if (!showRecentSearches || !query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 10); // 최대 10개까지만 저장

    setRecentSearches(updatedSearches);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      saveRecentSearch(inputValue.trim());
      onSearch(inputValue, currentFilter);
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('', currentFilter);
  };

  const handleFilterChange = (filter: SearchFilterType) => {
    setCurrentFilter(filter);
    setIsDropdownOpen(false);
    // 현재 검색어가 있다면 새 필터로 즉시 검색
    if (inputValue.trim()) {
      onSearch(inputValue, filter);
    }
  };

  const currentFilterLabel = filterOptions.find(option => option.value === currentFilter)?.label || '제목';

  const handleRecentSearchClick = (query: string) => {
    setInputValue(query);
    saveRecentSearch(query);
    onSearch(query, currentFilter);
    setIsFocused(false);
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

  return (
    <div className={`w-full relative ${className}`}>
      {/* 검색바 */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center">
          {/* 필터 드롭다운 */}
          {showFilter && (
            <div className="relative mr-1">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2.5 border border-grayLight rounded-lg
                         bg-white hover:bg-grayLighter focus:outline-none focus:ring-2 
                         focus:ring-primary focus:border-transparent text-textDefault
                         min-w-[90px] justify-between h-[42px]"
              >
                <span className="text-sm">{currentFilterLabel}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-grayLight 
                              rounded-lg shadow-lg z-10">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleFilterChange(option.value)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-grayLighter 
                                first:rounded-t-lg last:rounded-b-lg transition-colors
                                ${currentFilter === option.value ? 'bg-primary/10 text-primary' : 'text-textDefault'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 검색 입력창 */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder={placeholder}
              className={`w-full px-4 py-2.5 pr-20 border border-grayLight bg-white
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       text-textDefault h-[42px] rounded-lg`}
            />
            
            {/* 클리어 버튼 */}
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 
                         text-hintText hover:text-textDefault transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* 검색 버튼 */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2
                       p-1.5 bg-primary text-white rounded-md hover:bg-primary/90
                       transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* 최근 검색어 - 데스크톱: 드롭다운 */}
      {showRecentSearches && !mobileFullScreen && isFocused && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-grayLight
                      rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-textHeading">최근 검색어</h3>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-hintText hover:text-textDefault transition-colors"
              >
                전체삭제
              </button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(query)}
                  className="w-full text-left px-2 py-1.5 text-sm text-textDefault
                           hover:bg-grayLighter rounded transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 최근 검색어 - 모바일: 전체화면 */}
      {showRecentSearches && mobileFullScreen && isFocused && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white p-4 z-[9999]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">최근 검색어</h3>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              전체삭제
            </button>
          </div>
          <div className="space-y-2">
            {recentSearches.slice(0, 10).map((query, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <button
                  onClick={() => handleRecentSearchClick(query)}
                  className="flex-1 text-left text-sm text-gray-700"
                >
                  {query}
                </button>
                <button
                  onClick={() => removeRecentSearch(query)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 드롭다운 외부 클릭 시 닫기 */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};