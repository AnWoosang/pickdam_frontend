"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, User } from 'lucide-react';
import { User as UserType } from '@/domains/user/types/user';
import { ROUTES } from '@/app/router/routes';
import { getHeaderCategories, CATEGORY_CONFIG } from '@/domains/product/types/category';

interface SideMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

export const SideMenuModal: React.FC<SideMenuModalProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
  onLoginClick,
}) => {
  const router = useRouter();
  const headerCategories = getHeaderCategories();

  // 모달이 열릴 때 body 스크롤 방지
  React.useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // 스크롤 위치 복원
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const mainNavItems = [
    { label: '커뮤니티', href: ROUTES.COMMUNITY.LIST },
    { label: '나만의 액상찾기', href: ROUTES.LIQUID_FINDER },
    { label: '이벤트', href: ROUTES.EVENTS },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleCategoryClick = (groupTitle: string, category: string = '') => {
    // "모든 상품 보기" 처리
    if (groupTitle === '모든 상품 보기') {
      router.push(ROUTES.PRODUCT.LIST);
      onClose();
      return;
    }

    // 상위 카테고리 클릭 (category가 빈 문자열인 경우)
    if (category === '') {
      const categoryGroup = headerCategories.find(group => group.title === groupTitle);
      if (categoryGroup?.title) {
        // display name을 전달 (groupTitle이 이미 display name임)
        router.push(`${ROUTES.PRODUCT.LIST}?category=${groupTitle}`);
      } else {
        router.push(ROUTES.PRODUCT.LIST);
      }
      onClose();
      return;
    }

    // 서브카테고리 클릭 처리
    const categoryGroup = headerCategories.find(group => group.title === groupTitle);

    if (categoryGroup?.title) {
      // display name을 전달
      const categoryParam = groupTitle;

      // 카테고리 설정에서 서브카테고리 찾기
      const categoryConfig = CATEGORY_CONFIG.find(config => config.id === categoryGroup.id);
      const subCategory = categoryConfig?.subCategories.find(sub => sub.displayName === category);

      if (subCategory) {
        router.push(`${ROUTES.PRODUCT.LIST}?category=${categoryParam}&subCategory=${subCategory.name}`);
      } else {
        // 서브카테고리를 찾지 못한 경우 메인 카테고리로
        router.push(`${ROUTES.PRODUCT.LIST}?category=${categoryParam}`);
      }
    } else {
      // 폴백: 모든 상품 페이지로
      router.push(ROUTES.PRODUCT.LIST);
    }

    onClose();
  };

  const handleUserSectionClick = () => {
    if (isAuthenticated) {
      router.push(ROUTES.MYPAGE.HOME);
    } else {
      onLoginClick();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
        onClick={onClose}
      />

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[101] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold">메뉴</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* User Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={handleUserSectionClick}
                className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-semibold ">
                    {isAuthenticated ? '마이페이지' : '로그인 / 회원가입'}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Category Section */}
            <div className="border-b border-gray-200">
              <div className="px-4 py-3">
                <h3 className="text-base font-bold text-black">상품 카테고리</h3>
              </div>
              {headerCategories.map((group) => (
                <div key={group.title}>
                  {/* Main Category */}
                  <button
                    onClick={() => handleCategoryClick(group.title)}
                    className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-gray-900">{group.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Sub Categories */}
                  {group.categories.map((category) => (
                    <button
                      key={`${group.title}-${category}`}
                      onClick={() => handleCategoryClick(group.title, category)}
                      className="block w-full px-8 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Pages Section */}
            <div>
              <div className="px-4 py-3">
                <h3 className="text-base font-bold text-black">페이지</h3>
              </div>
              {mainNavItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-semibold text-gray-900">{item.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
