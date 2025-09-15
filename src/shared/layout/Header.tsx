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
    <header className="bg-white">
      <div className="w-full">
        {/* Logo & Search Section */}
        <div className="py-6 mb-2">
          <Container variant={containerVariant}>
            <LogoSearchSection showSearchBar={showSearchBar} />
          </Container>
        </div>

        {/* Category Bar */}
        {showCategoryBar && (
          <CategoryBar
            onSelected={handleTabSelect}
            containerVariant={containerVariant}
          />
        )}
      </div>
    </header>
  );
}