import React from 'react';
import { Star } from 'lucide-react';
import type { ReviewValidationErrors } from '@/domains/review/validation/reviewValidation';

const MAX_RATING = 5;

interface StarRatingProps {
  label: string;
  value: number;
  onChange: (rating: number) => void;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
  fieldName?: keyof ReviewValidationErrors;
  validationErrors?: ReviewValidationErrors;
}

export function StarRating({
  label,
  value,
  onChange,
  icon,
  color,
  fieldName,
  validationErrors = {}
}: StarRatingProps) {
  const IconComponent = icon;
  const hasError = fieldName && validationErrors[fieldName];

  return (
    <div className="space-y-2 md:space-y-2">
      <div className="flex items-center gap-1 md:gap-2">
        {IconComponent && <IconComponent className={`w-3 h-3 md:w-4 md:h-4 ${color}`} />}
        <span className={`text-xs md:text-sm font-medium ${hasError ? 'text-red-600' : 'text-gray-700'}`}>
          {label}
        </span>
        <span className="text-xs md:text-sm text-gray-500">({value}/{MAX_RATING})</span>
      </div>
      <div className="flex gap-0.5 md:gap-1">
        {Array.from({ length: MAX_RATING }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1.5 md:p-1 -m-1.5 md:-m-1 touch-manipulation"
          >
            <Star
              className={`w-4 h-4 md:w-6 md:h-6 transition-colors ${
                star <= value
                  ? 'text-yellow-400 fill-current'
                  : hasError
                    ? 'text-red-300 hover:text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-400'
              }`}
            />
          </button>
        ))}
      </div>
      {hasError && (
        <p className="text-[10px] md:text-xs text-red-600">{validationErrors[fieldName!]}</p>
      )}
    </div>
  );
}