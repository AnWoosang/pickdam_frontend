"use client";

import React from "react";
import { Header } from "./header/header";
import { Footer } from "./footer";
import { Container } from "./container";

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showCategoryBar?: boolean;
  showSearchBar?: boolean;
  containerVariant?: 'default' | 'wide' | 'narrow' | 'full';
  disableContainer?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showCategoryBar = true,
  showSearchBar = true,
  containerVariant = 'default',
  disableContainer = false,
}) => {

  // 오버스크롤 완전 비활성화
  React.useEffect(() => {
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    return () => {
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-y-auto" style={{ overscrollBehavior: 'none' }}>
      {showHeader && (
        <>
          <Header containerVariant={containerVariant} showCategoryBar={showCategoryBar} showSearchBar={showSearchBar} />
        </>
      )}
      <main className="flex-1 w-full relative">
        {disableContainer ? children : <Container variant={containerVariant}>{children}</Container>}
      </main>
      {showFooter && (
        <>
          <div className="w-full h-px bg-grayLight" />
          <Footer containerVariant={containerVariant} />
        </>
      )}
    </div>
  );
};