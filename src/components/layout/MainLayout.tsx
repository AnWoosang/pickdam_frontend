"use client";

import React from "react";
import { Header } from "./header/Header";
import { Footer } from "./Footer";
import { Container } from "./Container";

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

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-y-auto">
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