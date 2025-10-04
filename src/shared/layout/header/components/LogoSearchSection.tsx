"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoMenuOutline } from 'react-icons/io5';

import { ROUTES } from '@/app/router/routes';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useUIStore } from '@/domains/auth/store/authStore';
import { Logo } from '@/shared/components/Logo';
import { SearchBar } from '@/shared/components/SearchBar';
import { Button } from '@/shared/components/Button';
import { SearchModal } from '@/shared/layout/header/components/SearchModal';
import { SideMenuModal } from '@/shared/layout/SideMenuModal';
import { GuestMenu } from '@/shared/layout/header/components/GuestMenu';
import { RecentProductsTab } from '@/shared/layout/header/components/RecentProductsTab';
import { UserMenuDropdown } from '@/shared/layout/header/components/UserMenuDropdown';
import { WishlistTab } from '@/shared/layout/header/components/WishlistTab';

interface LogoSearchSectionProps {
  showSearchBar?: boolean;
}

export function LogoSearchSection({ showSearchBar = true }: LogoSearchSectionProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthUtils();
  const { openLoginModal } = useUIStore();

  const [activeSection, setActiveSection] = useState<'recent' | 'favorite' | 'user' | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSection = (section: 'recent' | 'favorite' | 'user') => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <>
      {/* 모바일: 햄버거 아이콘 왼쪽, 로고 중앙, 검색 아이콘 오른쪽 */}
      <div className="flex items-center justify-center w-full md:hidden relative px-4 h-12">
        <Button
          onClick={() => setIsSideMenuOpen(true)}
          variant="ghost"
          noFocus={true}
          className="absolute left-4 !p-1.5 !rounded-full hover:bg-gray-100"
          icon={<IoMenuOutline className="w-5 h-5 text-gray-600" />}
        />

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <Logo size="mobile" />
        </div>

        <Button
          onClick={() => setIsSearchModalOpen(true)}
          variant="ghost"
          noFocus={true}
          className="absolute right-4 !p-1.5 !rounded-full hover:bg-gray-100"
          icon={
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>

      {/* 데스크톱 */}
      <div className="hidden md:flex items-center w-full gap-4 lg:gap-0">
        <div className="flex-shrink-0 flex items-center">
          <Logo size="medium" />
        </div>

        <div className="flex-1 flex justify-center lg:mx-8">
          {showSearchBar ? (
            <SearchBar
              className="w-full lg:max-w-lg"
              onSearch={(query) => router.push(`${ROUTES.PRODUCT.LIST}?q=${encodeURIComponent(query)}`)}
              placeholder="상품을 검색하세요..."
              showRecentSearches={true}
            />
          ) : (
            <div className="w-full lg:max-w-lg h-10"></div>
          )}
        </div>

        <div className="flex-shrink-0 flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <RecentProductsTab
                isActive={activeSection === 'recent'}
                onToggle={() => toggleSection('recent')}
              />
              <WishlistTab
                user={user ?? null}
                isActive={activeSection === 'favorite'}
                onToggle={() => toggleSection('favorite')}
              />
              <UserMenuDropdown
                user={user ?? null}
                isActive={activeSection === 'user'}
                onToggle={() => toggleSection('user')}
              />
            </>
          ) : (
            <GuestMenu />
          )}
        </div>
      </div>

      {/* 검색 모달 */}
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />

      {/* 사이드 메뉴 모달 */}
      <SideMenuModal
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        user={user ?? null}
        isAuthenticated={isAuthenticated}
        onLoginClick={() => {
          setIsSideMenuOpen(false);
          openLoginModal();
        }}
      />
    </>
  );
}