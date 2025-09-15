'use client';

import React from 'react';
import { CATEGORY_CONFIG } from '@/domains/product/types/category';
import { INHALE_TYPE_NAMES } from '@/domains/product/types/product';

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
    <div className="bg-white border border-grayLight rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-textHeading">상품 필터</h3>
        <button
          onClick={onClearAllFilters}
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

              {/* 호흡방식 체크박스들 */}
              <td className="py-3 px-3 align-top">
                <div className="space-y-2">
                  {Object.entries(INHALE_TYPE_NAMES).map(([id, name]) => (
                    <label key={id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedInhaleTypes.includes(id)}
                        onChange={() => onInhaleTypeChange(id)}
                        className="w-4 h-4 text-primary bg-white border-grayLight rounded 
                                 focus:ring-2 focus:ring-primary focus:ring-offset-0
                                 checked:bg-primary checked:border-primary cursor-pointer"
                      />
                      <span className="text-sm text-textDefault">{name}</span>
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
                          onClick={() => onCategoryChange(categoryId)}
                          className="text-white hover:text-gray-200 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                  
                  {selectedInhaleTypes.map(inhaleTypeId => {
                    const name = INHALE_TYPE_NAMES[inhaleTypeId];
                    return (
                      <span
                        key={inhaleTypeId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-limeOlive text-white text-xs rounded-full mr-1 mb-1"
                      >
                        {name || inhaleTypeId}
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
    </div>
  );
}