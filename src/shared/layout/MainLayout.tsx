"use client";

import React from 'react';

import { Header } from './Header';
import { Footer } from './Footer';
import { Container } from './Container';
import { Divider } from '@/shared/components/Divider';
import { BannerSection } from '@/shared/components/BannerSection';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showCategoryBar?: boolean;
  showSearchBar?: boolean;
  showAds?: boolean;
  containerVariant?: 'default' | 'wide' | 'narrow' | 'full';
  disableContainer?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showCategoryBar = true,
  showSearchBar = true,
  showAds = true,
  containerVariant = 'default',
  disableContainer = false,
}) => {

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-y-auto">
      {showHeader && (
        <>
          <Header containerVariant={containerVariant} showCategoryBar={showCategoryBar} showSearchBar={showSearchBar} />
          <BannerSection show={showAds} />
        </>
      )}
      <main className="flex-1 w-full relative">
        {disableContainer ? children : <Container variant={containerVariant}>{children}</Container>}
      </main>
      {showFooter && (
        <>
          <Divider thickness="thin" color="medium" />
          <Footer containerVariant={containerVariant} />
        </>
      )}
    </div>
  );
};