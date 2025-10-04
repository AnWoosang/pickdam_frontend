"use client";

import { useState } from 'react';

import { Container } from '@/shared/layout/Container';
import { LogoSearchSection } from '@/shared/layout/header/components/LogoSearchSection';
import { CategoryBar } from '@/shared/layout/header/components/CategoryBar';

interface HeaderProps {
  showCategoryBar?: boolean;
  showSearchBar?: boolean;
  containerVariant?: 'default' | 'wide' | 'narrow' | 'full';
}

export function Header({ showCategoryBar = true, showSearchBar = true ,containerVariant = 'default' }: HeaderProps) {
  const [_selectedTab, setSelectedTab] = useState('홈');

  const handleTabSelect = (label: string) => {
    setSelectedTab(label);
  };

  return (
    <header className="bg-white border-b border-gray-200 md:border-b-0">
      <div className="w-full">
        {/* Logo & Search Section */}
        <div className="py-2 sm:py-3 lg:py-5 mb-2">
          <div className="md:hidden w-full">
            <LogoSearchSection showSearchBar={showSearchBar} />
          </div>
          <div className="hidden md:block">
            <Container variant={containerVariant}>
              <LogoSearchSection showSearchBar={showSearchBar} />
            </Container>
          </div>
        </div>

        {/* Category Bar - 모바일에서 숨김 */}
        {showCategoryBar && (
          <div className="hidden md:block">
            <CategoryBar
              onSelected={handleTabSelect}
              containerVariant={containerVariant}
            />
          </div>
        )}
      </div>
    </header>
  );
}