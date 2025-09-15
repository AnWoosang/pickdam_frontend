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
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {IconComponent && <IconComponent className={`w-4 h-4 ${color}`} />}
        <span className={`text-sm font-medium ${hasError ? 'text-red-600' : 'text-gray-700'}`}>
          {label}
        </span>
        <span className="text-sm text-gray-500">({value}/{MAX_RATING})</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: MAX_RATING }, (_, i) => i + 1).map((star) => (
          <Star
            key={star}
            onClick={() => onChange(star)}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              star <= value
                ? 'text-yellow-400 fill-current'
                : hasError 
                  ? 'text-red-300 hover:text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-400'
            }`}
          />
        ))}
      </div>
      {hasError && (
        <p className="text-xs text-red-600">{validationErrors[fieldName!]}</p>
      )}
    </div>
  );
}