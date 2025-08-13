'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductPreview, SearchFilters, SearchSortBy } from '@/types/search';
import { mockSearchProducts } from '@/constants/search-mock-data';

// 컴포넌트 imports
import { SearchHeader } from './searchHeader';
import { SearchFiltersBar } from './searchFiltersBar';
import { SearchResults } from './searchResults';
import { SearchPagination } from './searchPagination';
import { RecentSearches } from './recentSearches';
import { TrendingKeywords } from './trendingKeywords';

interface SearchPageProps {
  className?: string;
}

const ITEMS_PER_PAGE_OPTIONS = [24, 36, 48];
const DEFAULT_ITEMS_PER_PAGE = 24;

export function SearchPage({ className = '' }: SearchPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filteredProducts, setFilteredProducts] = useState<ProductPreview[]>([]);
  const [allProducts] = useState<ProductPreview[]>(mockSearchProducts);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  
  // 필터 상태
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    brands: [],
    inhaleTypes: [],
    priceRange: { min: 0, max: 100000 },
    sortBy: 'popularity',
    sortOrder: 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // URL 파라미터에서 초기 필터 설정
  useEffect(() => {
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const inhaleType = searchParams.get('inhaleType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') as SearchSortBy;
    const page = searchParams.get('page');

    setFilters(prev => ({
      ...prev,
      categories: category ? [category] : [],
      brands: brand ? [brand] : [],
      inhaleTypes: inhaleType ? [inhaleType] : [],
      priceRange: {
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice ? parseInt(maxPrice) : 100000,
      },
      sortBy: sortBy || 'popularity',
    }));

    if (page) {
      setCurrentPage(parseInt(page) - 1);
    }
  }, [searchParams]);

  // 검색 및 필터링 로직
  useEffect(() => {
    const applyFiltersAndSearch = () => {
      setIsLoading(true);
      
      const result = allProducts.filter(product => {
        // 키워드 검색
        const matchesKeyword = !searchQuery || 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.flavor.toLowerCase().includes(searchQuery.toLowerCase());

        // 카테고리 필터
        const matchesCategory = filters.categories.length === 0 || 
          filters.categories.includes(product.productCategory);

        // 브랜드 필터
        const matchesBrand = filters.brands.length === 0 || 
          filters.brands.includes(product.brand);

        // 호흡 방식 필터
        const matchesInhaleType = filters.inhaleTypes.length === 0 || 
          filters.inhaleTypes.includes(product.inhaleType);

        // 가격 필터
        const matchesPrice = product.price >= filters.priceRange.min && 
          product.price <= filters.priceRange.max;

        return matchesKeyword && matchesCategory && matchesBrand && 
               matchesInhaleType && matchesPrice;
      });

      // 정렬
      result.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'popularity':
            comparison = a.totalViews - b.totalViews;
            break;
          case 'newest':
            comparison = a.id.localeCompare(b.id); // 임시로 ID로 정렬
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          default:
            comparison = 0;
        }

        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });

      setFilteredProducts(result);
      setCurrentPage(0); // 필터 변경 시 첫 페이지로
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(applyFiltersAndSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters, allProducts]);

  // URL 업데이트
  const updateURL = React.useCallback(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (filters.categories.length > 0) params.set('category', filters.categories[0]);
    if (filters.brands.length > 0) params.set('brand', filters.brands[0]);
    if (filters.inhaleTypes.length > 0) params.set('inhaleType', filters.inhaleTypes[0]);
    if (filters.priceRange.min > 0) params.set('minPrice', filters.priceRange.min.toString());
    if (filters.priceRange.max < 100000) params.set('maxPrice', filters.priceRange.max.toString());
    if (filters.sortBy !== 'popularity') params.set('sortBy', filters.sortBy);
    if (currentPage > 0) params.set('page', (currentPage + 1).toString());

    const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
    router.replace(newURL);
  }, [searchQuery, filters, currentPage, router]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // 검색어 변경 처리
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // 필터 변경 처리
  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // 빈 검색 상태
  const hasNoQuery = !searchQuery.trim();
  const hasNoResults = !hasNoQuery && filteredProducts.length === 0;

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* 검색 헤더 */}
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          totalResults={filteredProducts.length}
        />

        <div className="px-8">
          {hasNoQuery ? (
            /* 검색어가 없을 때 - 최근 검색어, 인기 키워드 표시 */
            <div className="py-8 space-y-8">
              <RecentSearches onSearchClick={handleSearchChange} />
              <TrendingKeywords onKeywordClick={handleSearchChange} />
            </div>
          ) : (
            /* 검색 결과가 있을 때 */
            <div className="space-y-6">
              {/* 필터 바 */}
              {showFilters && (
                <SearchFiltersBar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  products={allProducts}
                />
              )}

              {/* 정렬 및 페이지 크기 선택 */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    총 {filteredProducts.length.toLocaleString()}개 상품
                  </span>
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* 정렬 선택 */}
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFiltersChange({ sortBy: e.target.value as SearchSortBy })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="popularity">인기순</option>
                    <option value="price">가격순</option>
                    <option value="newest">최신순</option>
                    <option value="name">이름순</option>
                  </select>

                  {/* 페이지 크기 선택 */}
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {ITEMS_PER_PAGE_OPTIONS.map(count => (
                      <option key={count} value={count}>
                        {count}개씩
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 검색 결과 */}
              {hasNoResults ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    검색 결과가 없습니다
                  </h3>
                  <p className="text-gray-600">
                    다른 검색어나 필터 조건을 시도해보세요
                  </p>
                </div>
              ) : (
                <SearchResults products={paginatedProducts} />
              )}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <SearchPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}