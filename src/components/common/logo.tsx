"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { RouteNames } from '@/constants/routes';

interface LogoProps {
  size?: 'small' | 'medium' | 'big';
  className?: string;
}

const SIZE_CLASSES = {
  small: 'text-lg font-bold',
  medium: 'text-xl font-bold', 
  big: 'text-2xl font-bold'
} as const;

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const router = useRouter();
  const sizeClass = SIZE_CLASSES[size];

  const handleLogoClick = () => {
    router.push(RouteNames.home);
  };

  return (
    <button
      onClick={handleLogoClick}
      className={`${sizeClass} text-primary hover:text-primaryDark transition-colors cursor-pointer ${className}`}
    >
      Pickdam
    </button>
  );
};