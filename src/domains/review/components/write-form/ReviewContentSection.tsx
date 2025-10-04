import React from 'react';
import type { ReviewForm } from '@/domains/review/types/review';
import type { ReviewValidationErrors } from '@/domains/review/validation/reviewValidation';

const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 1000;

interface ReviewContentSectionProps {
  formData: ReviewForm;
  validationErrors: ReviewValidationErrors;
  onContentChange: (content: string) => void;
}

export function ReviewContentSection({
  formData,
  validationErrors,
  onContentChange
}: ReviewContentSectionProps) {
  return (
    <div>
      <label className={`block text-xs md:text-sm font-medium mb-1.5 md:mb-2 ${validationErrors.content ? 'text-red-600' : 'text-gray-700'}`}>
        리뷰 내용 <span className="text-red-500">*</span>
      </label>
      <textarea
        value={formData.content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder={`상품에 대한 솔직한 후기를 작성해주세요. (최소 ${MIN_CONTENT_LENGTH}자)`}
        className={`w-full px-3 py-2 md:px-4 md:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none text-xs md:text-sm ${
          validationErrors.content
            ? 'border-red-300 focus:ring-red-200'
            : 'border-gray-300'
        }`}
        rows={4}
        maxLength={MAX_CONTENT_LENGTH}
      />
      <div className="flex items-center justify-between mt-1">
        <span className={`text-[10px] md:text-xs ${validationErrors.content ? 'text-red-500' : 'text-gray-500'}`}>
          {validationErrors.content ? validationErrors.content : `최소 ${MIN_CONTENT_LENGTH}자, 최대 ${MAX_CONTENT_LENGTH}자`}
        </span>
        <span className="text-[10px] md:text-xs text-gray-500">
          {formData.content.length}/{MAX_CONTENT_LENGTH}
        </span>
      </div>
    </div>
  );
}