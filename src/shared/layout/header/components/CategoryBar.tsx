"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, ChevronRight } from 'lucide-react';

import { ROUTES } from '@/app/router/routes';
import { getHeaderCategories, CATEGORY_CONFIG } from '@/domains/product/types/category';
import { cn } from '@/shared/utils/Format';
import { Container } from '@/shared/layout/Container';

interface CategoryBarProps {
  onSelected?: (category: string) => void;
  containerVariant?: 'default' | 'wide' | 'narrow' | 'full';
}

export function CategoryBar({ onSelected, containerVariant = 'default' }: CategoryBarProps) {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const headerCategories = getHeaderCategories();

  // 메인 네비게이션 메뉴
  const mainNavItems = [
    { label: '커뮤니티', href: '/community' },
    { label: '나에게 맞는 액상찾기', href: '/liquid-finder' },
    { label: '이벤트', href: '/events' },
  ] as const;

  const handleMainNavClick = (item: typeof mainNavItems[number]) => {
    router.push(item.href);
    onSelected?.(item.label);
  };

  const handleCategoryClick = (groupTitle: string, category: string) => {
    // "모든 상품 보기" 처리
    if (groupTitle === '모든 상품 보기') {
      router.push(ROUTES.PRODUCT.LIST);
      setActiveDropdown(null);
      onSelected?.(groupTitle);
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
      setActiveDropdown(null);
      onSelected?.(groupTitle);
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

    setActiveDropdown(null);
    onSelected?.(category);
  };

  const toggleCategoryDropdown = () => {
    setActiveDropdown(activeDropdown === 'category' ? null : 'category');
  };

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (activeDropdown || mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown, mobileMenuOpen]);

  return (
    <nav className="border-t border-grayLight border-b border-b-black bg-white">
      <Container variant={containerVariant}>
        <div className="flex items-center h-12">
          {/* 통합된 카테고리 드롭다운 - 맨 앞으로 이동 */}
          <div ref={dropdownRef} className="relative flex items-center">
            {/* 왼쪽 세로선 */}
            <div className={cn(
              "h-12 w-px transition-colors",
              activeDropdown === 'category' ? "bg-black" : "bg-grayLight"
            )}></div>
            
            <button
              onClick={toggleCategoryDropdown}
              className={cn(
                "flex items-center space-x-1 lg:space-x-2 pl-3 pr-6 lg:pl-7 lg:pr-12 h-10 lg:h-12 font-medium transition-colors cursor-pointer text-sm lg:text-base",
                activeDropdown === 'category'
                  ? "bg-black text-white font-bold"
                  : "font-bold text-black hover:text-textHeading hover:bg-gray-50"
              )}
            >
              <Menu className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>카테고리</span>
            </button>
            
            {/* 오른쪽 세로선 */}
            <div className={cn(
              "h-12 w-px transition-colors",
              activeDropdown === 'category' ? "bg-black" : "bg-grayLight"
            )}></div>

            {/* 드롭다운 메뉴 */}
            {activeDropdown === 'category' && (
              <div className="absolute top-full mt-px left-0 w-56 lg:w-64 bg-white border border-grayLight border-t border-t-grayLight
                            shadow-lg z-50">
                <div className="py-2">
                  {headerCategories.map((group) => (
                    <div key={group.title}>
                      {/* 카테고리 그룹 제목 - 모든 상위 카테고리 클릭 가능하게 */}
                      <button
                        onClick={() => handleCategoryClick(group.title, '')}
                        className="flex items-center w-full px-4 py-2 text-[15px] font-bold text-textHeading
                                 hover:bg-grayLighter hover:text-primary transition-colors cursor-pointer"
                      >
                        <span>{group.title}</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                      {/* 카테고리 항목들 */}
                      {group.categories.map((category) => (
                        <button
                          key={`${group.title}-${category}`}
                          onClick={() => handleCategoryClick(group.title, category)}
                          className="block w-full px-4 py-2 text-left text-sm text-textDefault 
                                   hover:bg-grayLighter hover:text-textHeading transition-colors cursor-pointer"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 메인 네비게이션 - 카테고리 뒤에 배치 (데스크톱만 표시) */}
          <div className="hidden lg:flex items-center space-x-12 ml-8 text-base text-black">
            {mainNavItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleMainNavClick(item)}
                className="text-black hover:text-textHeading font-bold transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 모바일 햄버거 메뉴 */}
          <div ref={mobileMenuRef} className="lg:hidden ml-auto relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 text-black hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* 모바일 드롭다운 메뉴 */}
            {mobileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-grayLight shadow-lg z-50">
                <div className="py-2">
                  {mainNavItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        handleMainNavClick(item);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-3 text-left text-sm font-medium text-black hover:bg-grayLighter hover:text-textHeading transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}

