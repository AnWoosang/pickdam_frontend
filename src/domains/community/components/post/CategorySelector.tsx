import React, { useMemo } from 'react';
import { Button } from '@/shared/components/Button';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { PostCategoryId } from '@/domains/community/types/community';
import { POST_CATEGORIES } from '@/domains/community/types/community';
interface CategorySelectorProps {
  value: PostCategoryId | '';
  onChange: (updates: { categoryId: PostCategoryId }) => void;
  onErrorChange: (errors: { category?: string }) => void;
  error?: string;
  allowCurrentNotice?: boolean; // 수정 시 기존 공지사항 유지 허용
}

export const CategorySelector = React.memo(function CategorySelector({
  value,
  onChange,
  onErrorChange,
  error,
  allowCurrentNotice = false
}: CategorySelectorProps) {
  const { canWriteNotice } = useAuthUtils();

  const categoryEntries = useMemo(() => {
    const allCategories = Object.entries(POST_CATEGORIES) as [PostCategoryId, string][];
    const isAdmin = canWriteNotice();

    // 관리자이거나, 현재 선택된 값이 공지사항이고 수정 허용인 경우 모든 카테고리 반환
    if (isAdmin || (allowCurrentNotice && value === 'NOTICE')) {
      return allCategories;
    }

    // 관리자가 아니면 공지사항 카테고리 제외
    return allCategories.filter(([categoryId]) => categoryId !== 'NOTICE');
  }, [canWriteNotice, allowCurrentNotice, value]);

  const handleCategoryChange = (categoryId: PostCategoryId) => {
    onChange({ categoryId });
    if (error) {
      onErrorChange({ category: undefined });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        카테고리 <span className="text-red-500">*</span>
      </label>
      
      <div className="flex flex-wrap gap-2">
        {categoryEntries.map(([categoryId, categoryName]) => {
          const isSelected = value === categoryId;
          return (
            <Button
              key={categoryId}
              type="button"
              variant="secondary"
              size="small"
              onClick={() => handleCategoryChange(categoryId)}
              noFocus={true}
              className={isSelected ? 'bg-primary text-white border-primary' : ''}
            >
              {categoryName}
            </Button>
          );
        })}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
});