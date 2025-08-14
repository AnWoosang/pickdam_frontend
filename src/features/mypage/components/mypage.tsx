'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  Heart, 
  ShoppingBag, 
  FileText, 
  CreditCard, 
  MapPin, 
  Bell, 
  Shield,
  LogOut,
  Edit2,
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '@/features/login/hooks/useAuth';
import { MypageMenuItem } from '@/types/user';
import { LoginModal } from '@/components/modals/LoginModal';

interface MypageProps {
  className?: string;
}

// 메뉴 아이템 설정
const mypageMenuItems: MypageMenuItem[] = [
  {
    id: 'wishlist',
    label: '찜한 상품',
    icon: 'Heart',
    href: '/mypage/wishlist',
    badge: 5,
  },
  {
    id: 'orders',
    label: '주문 내역',
    icon: 'ShoppingBag',
    href: '/mypage/orders',
    badge: 2,
  },
  {
    id: 'reviews',
    label: '내 리뷰',
    icon: 'FileText',
    href: '/mypage/reviews',
  },
  {
    id: 'payments',
    label: '결제 수단',
    icon: 'CreditCard',
    href: '/mypage/payments',
  },
  {
    id: 'addresses',
    label: '배송지 관리',
    icon: 'MapPin',
    href: '/mypage/addresses',
  },
  {
    id: 'notifications',
    label: '알림 설정',
    icon: 'Bell',
    href: '/mypage/notifications',
  },
  {
    id: 'privacy',
    label: '개인정보 보호',
    icon: 'Shield',
    href: '/mypage/privacy',
  },
  {
    id: 'settings',
    label: '계정 설정',
    icon: 'Settings',
    href: '/mypage/settings',
  },
];

// 아이콘 컴포넌트 매핑
const iconComponents = {
  Heart,
  ShoppingBag,
  FileText,
  CreditCard,
  MapPin,
  Bell,
  Shield,
  Settings,
};

export function Mypage({ className = '' }: MypageProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = async () => {
    const confirmed = window.confirm('로그아웃 하시겠습니까?');
    if (!confirmed) return;

    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/mypage/profile/edit');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="text-center py-12">
          <div className="mb-4">
            <User className="w-16 h-16 mx-auto text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">로그인이 필요합니다</h3>
          <p className="text-gray-600 mb-6">마이페이지를 이용하시려면 로그인해주세요.</p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary transition-colors hover:bg-primary/90"
          >
            로그인하기
          </button>
        </div>
        
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </>
    );
  }

  const MenuItem = React.memo(({ item }: { item: MypageMenuItem }) => {
    const IconComponent = iconComponents[item.icon as keyof typeof iconComponents];
    
    return (
      <Link
        href={item.href}
        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
            <IconComponent className="w-5 h-5 text-gray-600" />
          </div>
          <span className="font-medium text-gray-900">{item.label}</span>
          {item.badge && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {item.badge}
            </span>
          )}
          {item.isNew && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              NEW
            </span>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </Link>
    );
  });

  MenuItem.displayName = 'MenuItem';

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
      </div>

      {/* 사용자 프로필 카드 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.name}
              </h2>
              <p className="text-base text-gray-600">
                {user.email}
              </p>
              {user.provider && (
                <p className="text-xs text-gray-500 mt-1">
                  {user.provider === 'email' ? '이메일 계정' : `${user.provider} 연동`}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleEditProfile}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>수정</span>
          </button>
        </div>
      </div>

      {/* 메뉴 그리드 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {mypageMenuItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>

      {/* 로그아웃 버튼 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center justify-center w-full space-x-2 p-3 text-red-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">
            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          </span>
        </button>
      </div>

      {/* 사용자 통계 (옵션) */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-primary">12</div>
          <div className="text-sm text-gray-600">총 주문</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-primary">5</div>
          <div className="text-sm text-gray-600">찜한 상품</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-primary">8</div>
          <div className="text-sm text-gray-600">작성한 리뷰</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {user.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
          </div>
          <div className="text-sm text-gray-600">가입일</div>
        </div>
      </div>
    </div>
  );
}