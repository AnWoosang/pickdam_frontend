'use client';

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = '로딩 중...', 
  className = '' 
}) => (
  <div className={`flex justify-center items-center py-12 ${className}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2 text-gray-600">{message}</span>
  </div>
);