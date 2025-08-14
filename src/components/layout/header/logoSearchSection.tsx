"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Clock, Heart } from 'lucide-react';
import { RouteNames } from '@/constants/routes';
import { useAuth } from '@/features/login/hooks/useAuth';
import { LoginModal } from '@/components/modals/LoginModal';
import { SearchBar } from '@/components/common/SearchBar';

interface LogoSearchSectionProps {
  showSearchBar?: boolean;
}

export function LogoSearchSection({ showSearchBar = true }: LogoSearchSectionProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<'recent' | 'favorite' | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const recentViewedProducts = ['상품 A', '상품 B', '상품 C', '상품 D', '상품 E'];
  const favoriteProducts = ['찜한 A', '찜한 B'];

  const handleLogoClick = () => {
    router.push(RouteNames.home);
  };


  const toggleSection = (section: 'recent' | 'favorite') => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="flex items-center w-full">
      {/* 로고 */}
      <div className="flex-shrink-0">
        <button
          onClick={handleLogoClick}
          className="text-2xl font-bold text-primary hover:text-primaryDark transition-colors cursor-pointer"
        >
          Pickdam
        </button>
      </div>

      {/* 검색창 / 빈 공간 */}
      <div className="flex-1 flex justify-center mx-8">
        {showSearchBar ? (
          <SearchBar 
            className="w-full max-w-lg" 
            onSearch={(query) => router.push(`/products?q=${encodeURIComponent(query)}`)}
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
            <div className="relative">
              <button
                onClick={() => toggleSection('recent')}
                className={`flex items-center space-x-1 pb-1 transition-colors cursor-pointer
                  ${activeSection === 'recent' 
                    ? 'text-textHeading border-b-2 border-primary' 
                    : 'text-gray hover:text-textHeading'
                  }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm">최근 본 상품</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {activeSection === 'recent' && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-grayLight 
                              rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold mb-3 text-textHeading">🔥 최근에 조회하신 상품이에요</h3>
                    <div className="space-y-2">
                      {recentViewedProducts.map((product, index) => (
                        <div key={index} className="text-sm text-textDefault hover:text-textHeading cursor-pointer transition-colors">
                          {product}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleSection('favorite')}
                className={`flex items-center space-x-1 pb-1 transition-colors cursor-pointer
                  ${activeSection === 'favorite' 
                    ? 'text-textHeading border-b-2 border-primary' 
                    : 'text-gray hover:text-textHeading'
                  }`}
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm">찜한 상품</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {activeSection === 'favorite' && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-grayLight 
                              rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold mb-3 text-textHeading">❤️ 찜한 상품이에요</h3>
                    <div className="space-y-2">
                      {favoriteProducts.length > 0 ? (
                        favoriteProducts.map((product, index) => (
                          <div key={index} className="text-sm text-textDefault hover:text-textHeading cursor-pointer transition-colors">
                            {product}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-hintText">찜한 상품이 없습니다.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // 로그인되지 않은 경우: 로그인 & 회원가입 버튼
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-sm text-textDefault hover:text-textHeading transition-colors cursor-pointer"
            >
              로그인
            </button>
            <span className="text-hintText">|</span>
            <button
              onClick={() => router.push(RouteNames.signup)}
              className="text-sm text-textDefault hover:text-textHeading transition-colors cursor-pointer"
            >
              회원가입
            </button>
            <span className="text-hintText">|</span>
            <button
              onClick={() => {/* TODO: 고객센터 페이지 */}}
              className="text-sm text-textDefault hover:text-textHeading transition-colors cursor-pointer"
            >
              고객센터
            </button>
          </div>
        )}
      </div>

      {/* 로그인 모달 */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

