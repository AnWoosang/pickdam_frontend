'use client';

import React from 'react';

export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'custom';

export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: string; // custom 색상
  className?: string;
  onClick?: () => void;
}

const variantClasses = {
  default: 'bg-gray-500 text-white',
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-500 text-white',
  custom: '', // 커스텀 색상 사용시 빈 문자열
};

const sizeClasses = {
  small: 'px-2 py-0.5 text-xs',
  medium: 'px-2 py-1 text-xs',
  large: 'px-3 py-1 text-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  color,
  className = '',
  onClick,
}) => {
  const baseClasses = 'inline-flex items-center rounded-lg font-medium transition-colors';
  
  // 커스텀 색상이 있고 variant가 custom이면 커스텀 스타일 사용
  const colorClasses = variant === 'custom' && color 
    ? 'text-white' 
    : variantClasses[variant];
  
  const sizeClass = sizeClasses[size];
  
  const combinedClasses = `${baseClasses} ${colorClasses} ${sizeClass} ${
    onClick ? 'cursor-pointer hover:opacity-80' : ''
  } ${className}`;

  const style = variant === 'custom' && color 
    ? { backgroundColor: color } 
    : undefined;

  return (
    <span
      className={combinedClasses}
      style={style}
      onClick={onClick}
    >
      {children}
    </span>
  );
};