'use client';

import React, { useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/common/SearchBar';
import { Breadcrumb, BreadcrumbItem } from '@/components/common/Breadcrumb';
import { mockProducts } from '@/constants/products-mockdata';
import { Product, SortBy, SortOrder, MainCategory, CATEGORY_CONFIG, getProductCategoriesForMain, InhaleType, INHALE_TYPE_CONFIG } from '@/types/product';

export function ProductsPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // URL에서 파라미터 읽기
  const category = searchParams.get('category');
  const subCategory = searchParams.get('subCategory');
  const searchQuery = searchParams.get('q') || '';
  const sortBy = (searchParams.get('sortBy') as SortBy) || 'popularity';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc';
  const currentPage = parseInt(searchParams.get('page') || '1');
  
  // URL 기반 필터 상태
  const selectedCategories = useMemo(() => {
    if (category && category !== 'all') return [category];
    return [];
  }, [category]);
  
  const selectedInhaleTypes = useMemo(() => {
    if (subCategory === 'dl') return [InhaleType.DL];
    if (subCategory === 'mtl') return [InhaleType.MTL];
    return [];
  }, [subCategory]);
  
  const itemsPerPage = 20;

  // URL 업데이트 헬퍼 함수
  const updateURL = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all' || value === 1) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // 새로운 통합 mock 데이터 사용 - 이미 Product 타입임
  const products: Product[] = useMemo(() => {
    return mockProducts;
  }, []);

  // 필터링 및 정렬
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.flavor.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query))
      );
    }

    // 카테고리 필터링 - 통합된 시스템 사용
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => {
        return selectedCategories.some(categoryId => {
          const allowedProductCategories = getProductCategoriesForMain(categoryId as MainCategory);
          return allowedProductCategories.includes(product.productCategory);
        });
      });
    }

    // 호흡 방식 필터링
    if (selectedInhaleTypes.length > 0) {
      filtered = filtered.filter(product => 
        selectedInhaleTypes.includes(product.inhaleType)
      );
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'popularity':
          comparison = b.totalViews - a.totalViews;
          break;
        case 'newest':
          comparison = 0; // 날짜 데이터가 없어서 기본 순서 유지
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [products, searchQuery, selectedCategories, selectedInhaleTypes, sortBy, sortOrder]);

  // 페이징
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  // 브레드크럼 아이템 생성
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: '카테고리' } // href 제거해서 클릭 불가능하게
    ];

    if (!category || category === 'all') {
      items.push({ label: '모든상품', href: '/products', isActive: true });
    } else {
      // 다른 카테고리에 있을 때는 "모든상품"을 클릭 가능하게
      items.push({ label: '모든상품', href: '/products' });
      
      const categoryConfig = CATEGORY_CONFIG.find(c => c.id === category);
      if (categoryConfig) {
        if (subCategory && subCategory !== 'all') {
          // 서브카테고리가 있으면 카테고리는 클릭 가능
          items.push({ label: categoryConfig.displayName, href: `/products?category=${category}` });
          
          const subCategoryConfig = categoryConfig.subCategories.find(s => s.name === subCategory);
          if (subCategoryConfig) {
            items.push({ label: subCategoryConfig.displayName, href: `/products?category=${category}&subCategory=${subCategory}`, isActive: true });
          }
        } else {
          // 서브카테고리가 없으면 카테고리가 현재 페이지 (클릭 가능하게)
          items.push({ label: categoryConfig.displayName, href: `/products?category=${category}`, isActive: true });
        }
      }
    }

    return items;
  };

  // 페이지 제목 생성
  const getPageTitle = () => {
    if (!category || category === 'all') {
      return '모든 상품';
    }

    const categoryConfig = CATEGORY_CONFIG.find(c => c.id === category);
    if (!categoryConfig) return '모든 상품';

    if (subCategory && subCategory !== 'all') {
      const subCategoryConfig = categoryConfig.subCategories.find(s => s.name === subCategory);
      if (subCategoryConfig) {
        return `${categoryConfig.displayName} - ${subCategoryConfig.displayName}`;
      }
    }

    return categoryConfig.displayName;
  };

  const handleProductClick = (productId: string) => {
    // 상품 상세 페이지로 이동
    window.location.href = `/product/${productId}`;
  };

  const handleSearch = (query: string) => {
    updateURL({ q: query, page: null });
  };

  const handleSortChange = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      updateURL({ sortBy: newSortBy, sortOrder: newSortOrder, page: null });
    } else {
      updateURL({ sortBy: newSortBy, sortOrder: 'desc', page: null });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      // 카테고리 제거
      updateURL({ category: null, page: null });
    } else {
      // 카테고리 추가 (현재는 단일 선택만 지원)
      updateURL({ category: categoryId, page: null });
    }
  };

  const handleInhaleTypeChange = (inhaleType: InhaleType) => {
    const inhaleTypeName = inhaleType === InhaleType.DL ? 'dl' : 'mtl';
    
    if (selectedInhaleTypes.includes(inhaleType)) {
      // 호흡방식 제거
      updateURL({ subCategory: null, page: null });
    } else {
      // 호흡방식 추가 (현재는 단일 선택만 지원)
      updateURL({ subCategory: inhaleTypeName, page: null });
    }
  };

  const clearAllFilters = () => {
    updateURL({ 
      q: null, 
      category: null, 
      subCategory: null, 
      sortBy: null, 
      sortOrder: null, 
      page: null 
    });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: page });
    window.scrollTo({ top: 0 });
  };

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.label === '카테고리') {
      // 카테고리 클릭 시 아무 동작 안함 (스타일만)
      return;
    } else if (item.label === '모든상품') {
      // 모든상품 클릭 시 전체 상품 페이지로
      router.push('/products');
    } else if (item.href) {
      // 기타 링크가 있는 경우
      router.push(item.href);
    }
  };

  // 페이징 번호 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="py-6">
      {/* 브레드크럼 네비게이션 */}
      <div className="mb-4">
        <Breadcrumb 
          items={getBreadcrumbItems()} 
          onItemClick={handleBreadcrumbClick}
        />
      </div>

      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-textHeading">
          {getPageTitle()}
        </h1>
      </div>

      {/* 검색바 */}
      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="상품명, 브랜드, 맛을 검색해보세요"
          className="max-w-md"
          initialValue={searchQuery}
          showRecentSearches={true}
        />
      </div>

      {/* 필터 및 정렬 */}
      <div className="mb-6">
        {/* 필터 표 */}
        <div className="bg-white border border-grayLight rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-textHeading">상품 필터</h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-hintText hover:text-textDefault transition-colors cursor-pointer"
            >
              모든 필터 해제
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-grayLight">
                  <th className="text-left py-2 px-3 text-sm font-medium text-textHeading">카테고리</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-textHeading">호흡방식</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-textHeading">
                    선택된 필터 ({selectedCategories.length + selectedInhaleTypes.length})
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* 카테고리 체크박스들 */}
                  <td className="py-3 px-3 align-top">
                    <div className="space-y-2">
                      {CATEGORY_CONFIG.map(config => (
                        <label key={config.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(config.id)}
                            onChange={() => handleCategoryChange(config.id)}
                            className="w-4 h-4 text-primary bg-white border-grayLight rounded 
                                     focus:ring-2 focus:ring-primary focus:ring-offset-0
                                     checked:bg-primary checked:border-primary cursor-pointer"
                          />
                          <span className="text-sm text-textDefault">{config.displayName}</span>
                        </label>
                      ))}
                    </div>
                  </td>

                  {/* 호흡방식 체크박스들 */}
                  <td className="py-3 px-3 align-top">
                    <div className="space-y-2">
                      {INHALE_TYPE_CONFIG.map(config => (
                        <label key={config.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedInhaleTypes.includes(config.id)}
                            onChange={() => handleInhaleTypeChange(config.id)}
                            className="w-4 h-4 text-primary bg-white border-grayLight rounded 
                                     focus:ring-2 focus:ring-primary focus:ring-offset-0
                                     checked:bg-primary checked:border-primary cursor-pointer"
                          />
                          <span className="text-sm text-textDefault">{config.displayName}</span>
                        </label>
                      ))}
                    </div>
                  </td>

                  {/* 선택된 필터 표시 */}
                  <td className="py-3 px-3 align-top">
                    <div className="space-y-1">
                      {selectedCategories.length === 0 && selectedInhaleTypes.length === 0 && (
                        <span className="text-sm text-hintText">선택된 필터가 없습니다</span>
                      )}
                      
                      {selectedCategories.map(categoryId => {
                        const config = CATEGORY_CONFIG.find(c => c.id === categoryId);
                        return (
                          <span
                            key={categoryId}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white text-xs rounded-full mr-1 mb-1"
                          >
                            {config?.displayName || categoryId}
                            <button
                              onClick={() => handleCategoryChange(categoryId)}
                              className="text-white hover:text-gray-200 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                      
                      {selectedInhaleTypes.map(inhaleType => {
                        const config = INHALE_TYPE_CONFIG.find(c => c.id === inhaleType);
                        return (
                          <span
                            key={inhaleType}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-limeOlive text-white text-xs rounded-full mr-1 mb-1"
                          >
                            {config?.displayName || inhaleType}
                            <button
                              onClick={() => handleInhaleTypeChange(inhaleType)}
                              className="text-white hover:text-gray-200 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-textDefault">
            총 {filteredAndSortedProducts.length}개의 상품
          </div>
          <div className="flex gap-2">
            {[
              { key: 'popularity', label: '인기순' },
              { key: 'price', label: '가격순' },
              { key: 'newest', label: '최신순' },
              { key: 'name', label: '이름순' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSortChange(key as SortBy)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  sortBy === key
                    ? 'bg-primary text-white'
                    : 'bg-grayLighter text-textDefault hover:bg-grayLight'
                }`}
              >
                {label}
                {sortBy === key && (
                  <span className="ml-1">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 상품 그리드 */}
      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>

          {/* 페이징 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              {/* 이전 페이지 */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === 1
                    ? 'text-hintText cursor-not-allowed'
                    : 'text-textDefault hover:bg-grayLighter'
                }`}
              >
                이전
              </button>

              {/* 페이지 번호 */}
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'text-textDefault hover:bg-grayLighter'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* 다음 페이지 */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === totalPages
                    ? 'text-hintText cursor-not-allowed'
                    : 'text-textDefault hover:bg-grayLighter'
                }`}
              >
                다음
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-hintText mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v1" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-textHeading mb-2">
            해당 조건에 맞는 상품이 없습니다
          </h3>
          <p className="text-textDefault">
            다른 검색어나 필터 조건을 시도해보세요.
          </p>
        </div>
      )}
    </div>
  );
}