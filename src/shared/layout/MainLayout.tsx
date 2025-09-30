"use client";

import React from 'react';

import { Header } from './Header';
import { Footer } from './Footer';
import { Container } from './Container';
import { Divider } from '@/shared/components/Divider';
import { BannerSection } from '@/shared/components/BannerSection';
import { SideAd } from '@/shared/components/SideAd';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showCategoryBar?: boolean;
  showSearchBar?: boolean;
  showAds?: boolean;
  showBannerAds?: boolean;
  showSideAd?: boolean;
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
          <BannerSection show={showAds} containerVariant={containerVariant} className="mt-2" />
        </>
      )}
      <main className="flex-1 w-full relative">
        {disableContainer ? children : <Container variant={containerVariant}>{children}</Container>}
      </main>

      {/* 사이드 광고 - 오른쪽 상단에 고정 */}
      {/* {showAds && (
        <aside className="fixed top-4 right-4 w-[160px] z-50 hidden xl:block">
          <SideAd show={showAds} />
        </aside>
      )} */}
      {showFooter && (
        <>
          <Divider thickness="thin" color="medium" />
          <Footer containerVariant={containerVariant} />
        </>
      )}
    </div>
  );
};