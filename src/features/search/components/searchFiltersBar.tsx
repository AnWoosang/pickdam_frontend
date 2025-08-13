'use client';

import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { SearchFilters } from '@/types/search';
import { ProductPreview } from '@/types/search';
import { availableBrands, availableInhaleTypes, availableCategories } from '@/constants/search-mock-data';

interface SearchFiltersBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  products: ProductPreview[];
  className?: string;
}

export function SearchFiltersBar({
  filters,
  onFiltersChange,
  products,
  className = ''
}: SearchFiltersBarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['categories', 'brands', 'priceRange'])
  );

  // 섹션 토글
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // 카테고리 토글
  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ categories: newCategories });
  };

  // 브랜드 토글
  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ brands: newBrands });
  };

  // 호흡 방식 토글
  const toggleInhaleType = (inhaleType: string) => {
    const newInhaleTypes = filters.inhaleTypes.includes(inhaleType)
      ? filters.inhaleTypes.filter(i => i !== inhaleType)
      : [...filters.inhaleTypes, inhaleType];
    onFiltersChange({ inhaleTypes: newInhaleTypes });
  };

  // 가격 범위 변경
  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    onFiltersChange({
      priceRange: {
        ...filters.priceRange,
        [type]: value,
      },
    });
  };

  // 모든 필터 초기화
  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      brands: [],
      inhaleTypes: [],
      priceRange: { min: 0, max: 100000 },
      sortBy: 'popularity',
      sortOrder: 'desc',
    });
  };

  // 활성 필터 개수 계산
  const activeFiltersCount = 
    filters.categories.length +
    filters.brands.length +
    filters.inhaleTypes.length +
    (filters.priceRange.min > 0 ? 1 : 0) +
    (filters.priceRange.max < 100000 ? 1 : 0);

  // 카테고리별 상품 개수 계산
  const getCategoryCount = (category: string) => {
    return products.filter(p => p.productCategory === category).length;
  };

  // 브랜드별 상품 개수 계산
  const getBrandCount = (brand: string) => {
    return products.filter(p => p.brand === brand).length;
  };

  // 호흡 방식별 상품 개수 계산
  const getInhaleTypeCount = (inhaleType: string) => {
    return products.filter(p => p.inhaleType === inhaleType).length;
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: string; 
    children: React.ReactNode; 
  }) => {
    const isExpanded = expandedSections.has(sectionKey);
    
    return (
      <div className="border-b border-gray-200 py-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">필터</h2>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500"
          >
            전체 해제
          </button>
        )}
      </div>

      {/* 활성 필터 태그 */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.categories.map(category => {
            const categoryInfo = availableCategories.find(c => c.value === category);
            return (
              <span
                key={category}
                className="inline-flex items-center px-2 py-1 bg-primary-light text-primary text-xs rounded-full"
              >
                {categoryInfo?.label || category}
                <button
                  onClick={() => toggleCategory(category)}
                  className="ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
          
          {filters.brands.map(brand => (
            <span
              key={brand}
              className="inline-flex items-center px-2 py-1 bg-primary-light text-primary text-xs rounded-full"
            >
              {brand}
              <button
                onClick={() => toggleBrand(brand)}
                className="ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {filters.inhaleTypes.map(inhaleType => (
            <span
              key={inhaleType}
              className="inline-flex items-center px-2 py-1 bg-primary-light text-primary text-xs rounded-full"
            >
              {inhaleType}
              <button
                onClick={() => toggleInhaleType(inhaleType)}
                className="ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 필터 섹션들 */}
      <div className="space-y-0">
        {/* 카테고리 필터 */}
        <FilterSection title="카테고리" sectionKey="categories">
          <div className="space-y-2">
            {availableCategories.map(category => (
              <label
                key={category.value}
                className="flex items-center justify-between p-2 rounded"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.value)}
                    onChange={() => toggleCategory(category.value)}
                    className="rounded text-primary focus:ring-primary mr-3"
                  />
                  <span className="text-sm text-gray-700">{category.label}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {getCategoryCount(category.value)}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* 브랜드 필터 */}
        <FilterSection title="브랜드" sectionKey="brands">
          <div className="space-y-2">
            {availableBrands.map(brand => (
              <label
                key={brand}
                className="flex items-center justify-between p-2 rounded"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded text-primary focus:ring-primary mr-3"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {getBrandCount(brand)}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* 호흡 방식 필터 */}
        <FilterSection title="호흡 방식" sectionKey="inhaleTypes">
          <div className="space-y-2">
            {availableInhaleTypes.map(inhaleType => (
              <label
                key={inhaleType}
                className="flex items-center justify-between p-2 rounded"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inhaleTypes.includes(inhaleType)}
                    onChange={() => toggleInhaleType(inhaleType)}
                    className="rounded text-primary focus:ring-primary mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    {inhaleType === 'MTL' ? 'MTL (입호흡)' : 'DTL (폐호흡)'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {getInhaleTypeCount(inhaleType)}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* 가격 필터 */}
        <FilterSection title="가격 범위" sectionKey="priceRange">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">최소 가격</label>
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="0"
                />
              </div>
              
              <div className="text-gray-400">-</div>
              
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">최대 가격</label>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 100000)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="100000"
                />
              </div>
            </div>

            {/* 빠른 가격 범위 버튼 */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: '1만원 이하', min: 0, max: 10000 },
                { label: '1-3만원', min: 10000, max: 30000 },
                { label: '3-5만원', min: 30000, max: 50000 },
                { label: '5만원 이상', min: 50000, max: 100000 },
              ].map(range => (
                <button
                  key={range.label}
                  onClick={() => onFiltersChange({ 
                    priceRange: { min: range.min, max: range.max } 
                  })}
                  className={`px-3 py-1 text-xs border rounded-full ${
                    filters.priceRange.min === range.min && filters.priceRange.max === range.max
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
}