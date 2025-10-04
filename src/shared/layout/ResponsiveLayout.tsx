"use client";

import React from 'react';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { MainLayout } from './MainLayout';
import { MobileLayout } from './MobileLayout';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showCategoryBar?: boolean;
  showSearchBar?: boolean;
  showAds?: boolean;
  containerVariant?: 'default' | 'wide' | 'narrow' | 'full';
  disableContainer?: boolean;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showCategoryBar = true,
  showSearchBar = true,
  showAds = true,
  containerVariant = 'default',
  disableContainer = false,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <MobileLayout
        showHeader={showHeader}
        showFooter={showFooter}
        showCategoryBar={showCategoryBar}
        showSearchBar={showSearchBar}
        showAds={showAds}
      >
        {children}
      </MobileLayout>
    );
  }

  return (
    <MainLayout
      showHeader={showHeader}
      showFooter={showFooter}
      showCategoryBar={showCategoryBar}
      showSearchBar={showSearchBar}
      showAds={showAds}
      containerVariant={containerVariant}
      disableContainer={disableContainer}
    >
      {children}
    </MainLayout>
  );
};
