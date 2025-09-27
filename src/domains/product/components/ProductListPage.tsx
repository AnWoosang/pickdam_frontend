'use client';

import React from 'react';
import { ProductListHeader } from './ProductListHeader';
import { ProductFilters } from './ProductFilters';
import { ProductSortAndView } from './ProductSortAndView';
import { ProductGrid } from './ProductGrid';
import { useProductList } from '../hooks/useProductList';

export function ProductListPage() {
  
  // 통합된 훅 사용
  const {
    filters,
    products,
    isLoading,
    totalCount,
    totalPages,
    queryError,
    handleProductClick,
    handleSearch,
    handleSortChange,
    handleCategoryChange,
    handleInhaleTypeChange,
    clearAllFilters,
    handlePageChange,
    handleItemsPerPageChange,
  } = useProductList();
  
  // 구조분해로 접근성 개선
  const {
    category,
    searchQuery,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    selectedCategories,
    selectedInhaleTypes
  } = filters;

  const paginatedProducts = products;


  return (
    <div className="py-6">
      <ProductListHeader
        category={category || undefined}
        subCategory={filters.subCategory || undefined}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      <div className="mb-6">
        <ProductFilters
          selectedCategories={selectedCategories}
          selectedInhaleTypes={selectedInhaleTypes}
          onCategoryChange={handleCategoryChange}
          onInhaleTypeChange={handleInhaleTypeChange}
          onClearAllFilters={clearAllFilters}
        />

        <ProductSortAndView
          totalCount={totalCount}
          isLoading={isLoading}
          itemsPerPage={itemsPerPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onItemsPerPageChange={handleItemsPerPageChange}
          onSortChange={handleSortChange}
        />
      </div>

      <ProductGrid
        products={paginatedProducts}
        isLoading={isLoading}
        hasError={queryError}
        currentPage={currentPage}
        totalPages={totalPages}
        onProductClick={handleProductClick}
        onPageChange={handlePageChange}
      />
    </div>
  );
}