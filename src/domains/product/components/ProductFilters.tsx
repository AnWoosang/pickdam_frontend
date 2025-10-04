'use client';

import React from 'react';
import { CATEGORY_CONFIG, INHALE_TYPE_CONFIG } from '@/domains/product/types/category';

export interface ProductFiltersProps {
  selectedCategories: string[];
  selectedInhaleTypes: string[]; // InhaleType ID들 ('MTL', 'DL')
  onCategoryChange: (categoryId: string) => void;
  onInhaleTypeChange: (inhaleTypeId: string) => void;
  onClearAllFilters: () => void;
}

export function ProductFilters({
  selectedCategories,
  selectedInhaleTypes,
  onCategoryChange,
  onInhaleTypeChange,
  onClearAllFilters
}: ProductFiltersProps) {
  return (
    <div className="bg-white border border-grayLight rounded-lg p-3 sm:p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base sm:text-lg font-medium text-textHeading">상품 필터</h3>
        <button
          onClick={onClearAllFilters}
          className="text-xs sm:text-sm text-hintText hover:text-textDefault transition-colors cursor-pointer"
        >
          모든 필터 해제
        </button>
      </div>

      {/* 데스크톱: 테이블 레이아웃 */}
      <div className="hidden md:block overflow-x-auto">
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
              <td className="py-3 px-3 align-top">
                <div className="space-y-2">
                  {CATEGORY_CONFIG.map(config => (
                    <label key={config.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(config.id)}
                        onChange={() => onCategoryChange(config.id)}
                        className="w-4 h-4 text-primary bg-white border-grayLight rounded
                                 focus:ring-2 focus:ring-primary focus:ring-offset-0
                                 checked:bg-primary checked:border-primary cursor-pointer"
                      />
                      <span className="text-sm text-textDefault">{config.displayName}</span>
                    </label>
                  ))}
                </div>
              </td>
              <td className="py-3 px-3 align-top">
                <div className="space-y-2">
                  {INHALE_TYPE_CONFIG.map(config => (
                    <label key={config.name} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedInhaleTypes.includes(config.name)}
                        onChange={() => onInhaleTypeChange(config.name)}
                        className="w-4 h-4 text-primary bg-white border-grayLight rounded
                                 focus:ring-2 focus:ring-primary focus:ring-offset-0
                                 checked:bg-primary checked:border-primary cursor-pointer"
                      />
                      <span className="text-sm text-textDefault">{config.displayName}</span>
                    </label>
                  ))}
                </div>
              </td>
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
                          onClick={() => onCategoryChange(categoryId)}
                          className="text-white hover:text-gray-200 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                  {selectedInhaleTypes.map(inhaleTypeId => {
                    const config = INHALE_TYPE_CONFIG.find(c => c.name === inhaleTypeId);
                    return (
                      <span
                        key={inhaleTypeId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-limeOlive text-white text-xs rounded-full mr-1 mb-1"
                      >
                        {config?.displayName || inhaleTypeId}
                        <button
                          onClick={() => onInhaleTypeChange(inhaleTypeId)}
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

      {/* 모바일: 세로 레이아웃 */}
      <div className="md:hidden space-y-3">
        {/* 카테고리 */}
        <div>
          <h4 className="text-sm font-semibold text-black mb-2.5">카테고리</h4>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_CONFIG.map(config => (
              <button
                key={config.id}
                onClick={() => onCategoryChange(config.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedCategories.includes(config.id)
                    ? 'bg-primary text-white'
                    : 'bg-grayLighter text-textDefault hover:bg-grayLight'
                }`}
              >
                {config.displayName}
              </button>
            ))}
          </div>
        </div>

        {/* 호흡방식 */}
        <div>
          <h4 className="text-sm font-semibold text-black mb-2.5">호흡방식</h4>
          <div className="flex flex-wrap gap-2">
            {INHALE_TYPE_CONFIG.map(config => (
              <button
                key={config.name}
                onClick={() => onInhaleTypeChange(config.name)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedInhaleTypes.includes(config.name)
                    ? 'bg-primary text-white'
                    : 'bg-grayLighter text-textDefault hover:bg-grayLight'
                }`}
              >
                {config.displayName}
              </button>
            ))}
          </div>
        </div>

        {/* 선택된 필터 */}
        {(selectedCategories.length > 0 || selectedInhaleTypes.length > 0) && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-sm font-semibold text-black">
                선택된 필터 ({selectedCategories.length + selectedInhaleTypes.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(categoryId => {
                const config = CATEGORY_CONFIG.find(c => c.id === categoryId);
                return (
                  <button
                    key={categoryId}
                    onClick={() => onCategoryChange(categoryId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    {config?.displayName || categoryId}
                    <span className="text-white">×</span>
                  </button>
                );
              })}
              {selectedInhaleTypes.map(inhaleTypeId => {
                const config = INHALE_TYPE_CONFIG.find(c => c.name === inhaleTypeId);
                return (
                  <button
                    key={inhaleTypeId}
                    onClick={() => onInhaleTypeChange(inhaleTypeId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    {config?.displayName || inhaleTypeId}
                    <span className="text-white">×</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}