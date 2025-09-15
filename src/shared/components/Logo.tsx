"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ROUTES } from '@/app/router/routes';

export interface LogoProps {
  size?: 'small' | 'medium' | 'big';
  className?: string;
}

const SIZE_DIMENSIONS = {
  small: { width: 100, height: 36 },
  medium: { width: 135, height: 48 }, 
  big: { width: 200, height: 58 }
} as const;

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const router = useRouter();
  const dimensions = SIZE_DIMENSIONS[size];

  const handleLogoClick = () => {
    router.push(ROUTES.HOME);
  };

  return (
    <button
      onClick={handleLogoClick}
      className={`hover:opacity-80 transition-opacity cursor-pointer ${className}`}
    >
      <Image
        src="/logo/pickdam_logo.svg"
        alt="Pickdam 로고"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain"
        priority
      />
    </button>
  );
};