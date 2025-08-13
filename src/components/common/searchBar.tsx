"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { RouteNames } from '@/constants/routes';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
  initialValue?: string;
}

export function SearchBar({ 
  placeholder = "찾으시는 제품명을 검색해보세요",
  className = "",
  onSearch,
  initialValue = ""
}: SearchBarProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(initialValue);

  // initialValue 변경 시 searchValue 업데이트
  React.useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue.trim());
    } else if (searchValue.trim()) {
      router.push(`${RouteNames.search}?q=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-4 pr-12 border border-grayLight rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                   placeholder:text-hintText bg-white text-textHeading"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 
                   text-gray hover:text-primary transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}