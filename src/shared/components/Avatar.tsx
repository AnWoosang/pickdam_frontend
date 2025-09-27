'use client';

import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  fallbackIcon?: React.ReactNode;
  className?: string;
}

export function Avatar({
  src,
  alt = '프로필 사진',
  size = 'medium',
  fallbackIcon,
  className = ''
}: AvatarProps) {
  const sizeClasses = {
    xsmall: 'w-6 h-6',
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const iconSizes = {
    xsmall: 'w-3 h-3',
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-8 h-8'
  };

  const baseClasses = `${sizeClasses[size]} bg-primary-light rounded-full flex items-center justify-center overflow-hidden border border-gray-200 relative ${className}`;

  // 프로필 사진이 있는 경우
  if (src) {
    return (
      <div className={baseClasses}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover rounded-full"
          sizes={sizeClasses[size].replace('w-', '').replace('h-', '').split(' ')[0]}
        />
      </div>
    );
  }

  // 폴백 아이콘 또는 기본 User 아이콘
  const FallbackIcon = fallbackIcon || <User className={`${iconSizes[size]} text-primary`} />;

  return (
    <div className={baseClasses}>
      {FallbackIcon}
    </div>
  );
}