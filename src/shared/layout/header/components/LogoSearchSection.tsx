"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/app/router/routes';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { Logo } from '@/shared/components/Logo';
import { SearchBar } from '@/shared/components/SearchBar';
import { GuestMenu } from '@/shared/layout/header/components/GuestMenu';
import { RecentProductsDropdown } from '@/shared/layout/header/components/RecentProductsDropdown';
import { UserMenuDropdown } from '@/shared/layout/header/components/UserMenuDropdown';
import { WishlistDropdown } from '@/shared/layout/header/components/WishlistDropdown';

interface LogoSearchSectionProps {
  showSearchBar?: boolean;
}

export function LogoSearchSection({ showSearchBar = true }: LogoSearchSectionProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthUtils();

  const [activeSection, setActiveSection] = useState<'recent' | 'favorite' | 'user' | null>(null);
  

  const toggleSection = (section: 'recent' | 'favorite' | 'user') => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };



  return (
    <div className="flex items-center w-full">
      {/* 로고 */}
      <div className="flex-shrink-0 flex items-center">
        <Logo size="medium" />
      </div>

      {/* 검색창 / 빈 공간 */}
      <div className="flex-1 flex justify-center mx-8">
        {showSearchBar ? (
          <SearchBar 
            className="w-full max-w-lg" 
            onSearch={(query) => router.push(`${ROUTES.PRODUCT.LIST}?q=${encodeURIComponent(query)}`)}
            placeholder="상품을 검색하세요..."
            showRecentSearches={true}
          />
        ) : (
          // 검색바가 없을 때 빈 공간 유지
          <div className="w-full max-w-lg h-10"></div>
        )}
      </div>

      {/* 로그인 상태에 따른 우측 메뉴 */}
      <div className="flex-shrink-0 flex items-center space-x-4">
        {isAuthenticated ? (
          // 로그인된 경우: 최근 본 상품 & 찜한 상품
          <>
            <RecentProductsDropdown
              isActive={activeSection === 'recent'}
              onToggle={() => toggleSection('recent')}
            />

            <WishlistDropdown
              user={user}
              isActive={activeSection === 'favorite'}
              onToggle={() => toggleSection('favorite')}
            />

            <UserMenuDropdown
              user={user}
              isActive={activeSection === 'user'}
              onToggle={() => toggleSection('user')}
            />
          </>
        ) : (
          <GuestMenu />
        )}
      </div>
    </div>
  );
}

