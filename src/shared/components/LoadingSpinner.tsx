'use client';

import React from 'react';

type SpinnerSize = 'small' | 'medium' | 'large';

export interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  size?: SpinnerSize;
  showMessage?: boolean;
}

const sizeClasses = {
  small: 'h-4 w-4',
  medium: 'h-6 w-6', 
  large: 'h-8 w-8'
} as const;

const containerClasses = {
  small: 'py-2',
  medium: 'py-6',
  large: 'py-12'
} as const;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = '로딩 중...', 
  className = '',
  size = 'large',
  showMessage = true
}) => (
  <div className={`flex justify-center items-center ${containerClasses[size]} ${className}`}>
    <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}></div>
    {showMessage && <span className="ml-2 text-gray-600">{message}</span>}
  </div>
);