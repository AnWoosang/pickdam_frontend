"use client";

import React from 'react';

import { Header } from './Header';
import { Footer } from './Footer';
import { Divider } from '@/shared/components/Divider';
import { BannerSection } from '@/shared/components/BannerSection';
import { BottomNavigation } from './BottomNavigation';

interface MobileLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showCategoryBar?: boolean;
  showSearchBar?: boolean;
  showAds?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showCategoryBar = true,
  showSearchBar = true,
  showAds = true,
}) => {

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {showHeader && (
        <>
          <Header containerVariant="full" showCategoryBar={showCategoryBar} showSearchBar={showSearchBar} />
          <BannerSection show={showAds} containerVariant="full" className="mt-4 mb-2" />
        </>
      )}
      <main className="flex-1 w-full relative overflow-x-hidden pb-16 px-2">
        {children}
      </main>

      {showFooter && (
        <>
          <Divider thickness="thin" color="medium" />
          <Footer containerVariant="full" />
        </>
      )}

      {/* 하단 네비게이션 바 */}
      <BottomNavigation />
    </div>
  );
};
