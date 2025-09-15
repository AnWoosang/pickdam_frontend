import React from 'react';
import { Star, Heart, Wind, Zap, Droplets, Info } from 'lucide-react';
import { StarRating } from './StarRating';
import type { ReviewForm } from '@/domains/review/types/review';
import type { ReviewValidationErrors } from '@/domains/review/validation/reviewValidation';

const RATING_SCALE = [1, 2, 3, 4, 5] as const;
const MAX_RATING = 5;

const DETAILED_RATINGS = [
  { field: 'sweetness' as const, label: '달콤함', icon: Heart, color: 'text-pink-500' },
  { field: 'menthol' as const, label: '멘솔감', icon: Wind, color: 'text-blue-500' },
  { field: 'throatHit' as const, label: '목넘김', icon: Zap, color: 'text-yellow-500' },
  { field: 'body' as const, label: '바디감', icon: Droplets, color: 'text-purple-500' },
  { field: 'freshness' as const, label: '신선함', icon: Info, color: 'text-green-500' },
] as const;

const ErrorMessage = ({ error }: { error?: string }) => 
  error ? <p className="text-xs text-red-600 mt-1">{error}</p> : null;

interface ReviewRatingSectionProps {
  formData: ReviewForm;
  validationErrors: ReviewValidationErrors;
  onRatingChange: (field: keyof ReviewForm, rating: number) => void;
}

export function ReviewRatingSection({
  formData,
  validationErrors,
  onRatingChange
}: ReviewRatingSectionProps) {
  const handleStarClick = React.useCallback(
    (rating: number) => {
      onRatingChange('rating', rating);
    },
    [onRatingChange]
  );

  const handleDetailedRatingChange = React.useCallback(
    (field: keyof ReviewForm) => (rating: number) => {
      onRatingChange(field, rating);
    },
    [onRatingChange]
  );

  return (
    <>
      {/* 전체 평점 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <label className={`text-sm font-medium ${
            validationErrors.rating ? 'text-red-600' : 'text-gray-700'
          }`}>
            전체 평점 <span className="text-red-500">*</span>
          </label>
          <span className="text-sm text-gray-500">
            ({formData.rating}/{MAX_RATING})
          </span>
        </div>
        
        <div className="flex gap-1" role="radiogroup" aria-label="전체 평점 선택">
          {RATING_SCALE.map((star) => (
            <Star
              key={star}
              onClick={() => handleStarClick(star)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStarClick(star);
                }
              }}
              tabIndex={0}
              role="radio"
              aria-checked={star === formData.rating}
              aria-label={`${star}점`}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                star <= formData.rating
                  ? 'text-yellow-400 fill-current'
                  : validationErrors.rating
                    ? 'text-red-300 hover:text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-400'
              }`}
            />
          ))}
        </div>
        
        <ErrorMessage error={validationErrors.rating} />
      </div>

      {/* 상세 평가 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          상세 평가 <span className="text-red-500">*</span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {DETAILED_RATINGS.map(({ field, label, icon, color }) => (
            <StarRating
              key={field}
              label={label}
              value={formData[field]}
              onChange={handleDetailedRatingChange(field)}
              icon={icon}
              color={color}
              fieldName={field}
              validationErrors={validationErrors}
            />
          ))}
        </div>
      </div>
    </>
  );
}