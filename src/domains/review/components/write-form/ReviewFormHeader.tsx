import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/Button';

interface ReviewFormHeaderProps {
  onCancel: () => void;
}

export function ReviewFormHeader({ onCancel }: ReviewFormHeaderProps) {
  return (
    <div className="p-3 md:p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-sm md:text-lg font-semibold text-gray-900">리뷰 작성</h3>
        <Button
          variant="ghost"
          size="small"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          icon={<X className="w-4 h-4 md:w-5 md:h-5" />}
        />
      </div>
    </div>
  );
}