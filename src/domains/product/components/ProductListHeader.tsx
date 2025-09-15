'use client';

import React from 'react';
import { SearchBar } from '@/shared/components/SearchBar';
import { Breadcrumb, BreadcrumbItem } from '@/shared/components/Breadcrumb';
import { CATEGORY_CONFIG } from '@/domains/product/types/category';
import { ROUTES } from '@/app/router/routes';

export interface ProductListHeaderProps {
  category?: string;
  subCategory?: string;
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function ProductListHeader({
  category,
  subCategory,
  searchQuery,
  onSearch
}: ProductListHeaderProps) {
  
  // 브레드크럼 아이템 생성
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: '카테고리' }
    ];

    if (!category || category === 'all') {
      items.push({ label: '모든상품', href: ROUTES.PRODUCT.LIST, isActive: true });
    } else {
      items.push({ label: '모든상품', href: ROUTES.PRODUCT.LIST });
      
      const categoryConfig = CATEGORY_CONFIG.find(c => c.id === category);
      if (categoryConfig) {
        if (subCategory && subCategory !== 'all') {
          items.push({ label: categoryConfig.displayName, href: `${ROUTES.PRODUCT.LIST}?category=${category}` });
          
          const subCategoryConfig = categoryConfig.subCategories.find(s => s.name === subCategory);
          if (subCategoryConfig) {
            items.push({ 
              label: subCategoryConfig.displayName, 
              href: `${ROUTES.PRODUCT.LIST}?category=${category}&subCategory=${subCategory}`, 
              isActive: true 
            });
          }
        } else {
          items.push({ 
            label: categoryConfig.displayName, 
            href: `${ROUTES.PRODUCT.LIST}?category=${category}`, 
            isActive: true 
          });
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

  return (
    <>
      {/* 브레드크럼 네비게이션 */}
      <div className="mb-4">
        <Breadcrumb items={getBreadcrumbItems()} />
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
          onSearch={onSearch}
          placeholder="상품명, 브랜드, 맛을 검색해보세요"
          className="max-w-md"
          initialValue={searchQuery}
          showRecentSearches={true}
        />
      </div>
    </>
  );
}