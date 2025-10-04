import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'wide' | 'narrow' | 'full';
  className?: string;
}

const CONTAINER_VARIANTS = {
  default: 'max-w-7xl mx-auto px-3 sm:px-4 lg:px-14',
  wide: 'max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-8',
  narrow: 'max-w-4xl mx-auto px-3 sm:px-4 lg:px-6',
  full: 'w-full px-3 sm:px-4'
} as const;

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const containerClasses = CONTAINER_VARIANTS[variant];
  
  return (
    <div className={`${containerClasses} ${className}`}>
      {children}
    </div>
  );
};