'use client';

import React from 'react';

interface DividerProps {
  className?: string;
  thickness?: 'thin' | 'medium' | 'thick';
  color?: 'light' | 'medium' | 'dark';
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

export const Divider: React.FC<DividerProps> = ({
  className = '',
  thickness = 'thin',
  color = 'medium',
  spacing = 'none'
}) => {
  const thicknessClasses = {
    thin: 'border-t',
    medium: 'border-t-2',
    thick: 'border-t-4'
  };

  const colorClasses = {
    light: 'border-gray-100',
    medium: 'border-gray-300',
    dark: 'border-gray-500'
  };

  const spacingClasses = {
    none: '',
    small: 'my-2',
    medium: 'my-4',
    large: 'my-6'
  };

  const combinedClasses = `${thicknessClasses[thickness]} ${colorClasses[color]} ${spacingClasses[spacing]} ${className}`;

  return <div className={combinedClasses} />;
};