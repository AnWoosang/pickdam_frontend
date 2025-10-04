"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ROUTES } from '@/app/router/routes';
import { Button } from '@/shared/components/Button';
import { useUIStore } from '@/domains/auth/store/authStore';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { WishlistModal } from '@/shared/layout/header/components/WishlistModal';
import { SideMenuModal } from '@/shared/layout/SideMenuModal';
import { IoHomeOutline, IoHomeSharp, IoMenuOutline, IoMenu } from 'react-icons/io5';
import { HiOutlineShoppingBag, HiShoppingBag } from 'react-icons/hi2';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { HiOutlineUser, HiUser } from 'react-icons/hi2';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
  href: string;
  requiresAuth?: boolean;
  authHref?: string;
  authLabel?: string;
}

export const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { openLoginModal } = useUIStore();
  const { isAuthenticated, user } = useAuthUtils();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // 스크롤 다운 - 네비게이션 숨김
        setIsVisible(false);
      } else {
        // 스크롤 업 - 네비게이션 표시
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: '홈',
      icon: IoHomeOutline,
      activeIcon: IoHomeSharp,
      href: ROUTES.HOME,
    },
    {
      id: 'category',
      label: '카테고리',
      icon: IoMenuOutline,
      activeIcon: IoMenu,
      href: ROUTES.PRODUCT.LIST,
    },
    {
      id: 'products',
      label: '상품',
      icon: HiOutlineShoppingBag,
      activeIcon: HiShoppingBag,
      href: ROUTES.PRODUCT.LIST,
    },
    {
      id: 'liked',
      label: '좋아요',
      icon: IoHeartOutline,
      activeIcon: IoHeart,
      href: ROUTES.MYPAGE.LIKED_POSTS,
      requiresAuth: true,
    },
    {
      id: 'profile',
      label: isAuthenticated ? '마이페이지' : '로그인',
      icon: HiOutlineUser,
      activeIcon: HiUser,
      href: isAuthenticated ? ROUTES.MYPAGE.HOME : ROUTES.AUTH.SIGNUP,
      requiresAuth: true,
    },
  ];

  const isActive = (href: string) => {
    if (href === ROUTES.HOME) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleNavigation = (item: NavigationItem) => {
    // 카테고리 버튼 처리 - 사이드 메뉴 열기
    if (item.id === 'category') {
      setIsSideMenuOpen(true);
      return;
    }

    // 좋아요 버튼 처리
    if (item.id === 'liked') {
      if (!isAuthenticated) {
        openLoginModal();
      } else {
        setIsWishlistModalOpen(true);
      }
      return;
    }

    // 로그인이 필요한 항목인데 로그인되지 않았으면 로그인 모달 열기
    if (item.requiresAuth && !isAuthenticated) {
      openLoginModal();
    } else {
      router.push(item.href);
    }
  };

  return (
    <>
      <nav
      className={`
        fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden
        transition-transform duration-300
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => {
          const active = isActive(item.href);
          const IconComponent = active ? item.activeIcon : item.icon;

          return (
            <Button
              key={item.id}
              onClick={() => handleNavigation(item)}
              variant="ghost"
              noFocus={true}
              className={`
                flex flex-col items-center justify-center
                flex-1 h-full !gap-1
                transition-colors rounded-none
                ${active ? 'text-blue-600 hover:text-blue-600 hover:bg-transparent' : 'text-gray-600 hover:text-blue-500 hover:bg-transparent'}
              `}
            >
              <IconComponent className="text-2xl" />
              <span className="text-xs font-medium whitespace-nowrap">
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>

      {/* 찜하기/최근 본 상품 모달 */}
      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        user={user ?? null}
      />

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
};
