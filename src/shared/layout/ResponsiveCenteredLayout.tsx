"use client";

import React from 'react';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { Logo } from '@/shared/components/Logo';
import { BottomNavigation } from '@/shared/layout/BottomNavigation';

interface ResponsiveCenteredLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean;
  logoSize?: "small" | "medium" | "big";
  maxWidth?: "small" | "medium" | "large" | "wide";
  className?: string;
}

const maxWidthClasses = {
  small: "max-w-sm",
  medium: "max-w-md",
  large: "max-w-lg",
  wide: "max-w-xl",
};

export const ResponsiveCenteredLayout: React.FC<ResponsiveCenteredLayoutProps> = ({
  children,
  showLogo = true,
  logoSize = "big",
  maxWidth = "medium",
  className = "",
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className="min-h-screen overflow-y-auto bg-white">
        <div className={`flex flex-col items-center px-4 ${isMobile ? 'pt-4 pb-20' : 'pt-15 pb-20'} bg-white`}>
          <div className={`w-full ${maxWidthClasses[maxWidth]}`}>
            {showLogo && (
              <div className="text-center mb-8">
                <div className="md:hidden">
                  <Logo size="mobile" />
                </div>
                <div className="hidden md:block">
                  <Logo size={logoSize} />
                </div>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};
