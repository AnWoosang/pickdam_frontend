"use client";

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  noFocus?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  children,
  icon,
  type = 'button',
  noFocus = false
}: ButtonProps) {
  const isIconOnly = icon && !children;
  const focusClasses = noFocus 
    ? 'focus:outline-none focus:ring-0 focus:ring-offset-0' 
    : 'focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const baseClasses = `inline-flex items-center justify-center font-semibold transition-colors ${focusClasses} disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
    isIconOnly ? 'rounded-full' : 'rounded-lg'
  }`;
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
    destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    small: isIconOnly ? 'p-2 text-sm' : 'px-3 py-1 text-sm gap-1',
    medium: isIconOnly ? 'p-2.5 text-base' : 'px-4 py-2 text-base gap-2',
    large: isIconOnly ? 'p-3 text-lg' : 'px-6 py-3 text-lg gap-2'
  };
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}