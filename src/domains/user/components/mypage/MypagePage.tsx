'use client';

import React from 'react';
import { ROUTES } from '@/app/router/routes';
import { ProfileEditModal } from '@/domains/user/components/mypage/ProfileEditModal';
import { WithdrawModal } from '@/domains/user/components/WithdrawModal';
import { ProfileCard } from '@/domains/user/components/mypage/ProfileCard';
import { MenuItem } from '@/domains/user/components/mypage/MenuItem';
import { useMypage } from '@/domains/user/hooks/mypage/useMypage';

// 마이페이지 메뉴 아이템
export interface MypageMenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  isNew?: boolean;
  isAction?: boolean; // 액션 메뉴인지 구분
}

interface MypageProps {
  className?: string;
}

// 메뉴 아이템 설정 (모바일용)
const mypageMenuItemsMobile: MypageMenuItem[] = [
  {
    id: 'reviews',
    label: '내 리뷰',
    icon: 'FileText',
    href: '/mypage/reviews',
  },
  {
    id: 'my-posts',
    label: '내 게시글',
    icon: 'Edit3',
    href: ROUTES.MYPAGE.MY_POSTS,
  },
  {
    id: 'my-comments',
    label: '내 댓글',
    icon: 'MessageSquare',
    href: ROUTES.MYPAGE.MY_COMMENTS,
  },
  {
    id: 'logout',
    label: '로그아웃',
    icon: 'LogOut',
    href: '#',
    isAction: true,
  },
  {
    id: 'account-deletion',
    label: '회원탈퇴',
    icon: 'UserX',
    href: '#',
    isAction: true,
  },
];

// 메뉴 아이템 설정 (데스크탑용)
const mypageMenuItemsDesktop: MypageMenuItem[] = [
  {
    id: 'reviews',
    label: '내 리뷰',
    icon: 'FileText',
    href: '/mypage/reviews',
  },
  {
    id: 'my-posts',
    label: '내 게시글',
    icon: 'Edit3',
    href: ROUTES.MYPAGE.MY_POSTS,
  },
  {
    id: 'my-comments',
    label: '내 댓글',
    icon: 'MessageSquare',
    href: ROUTES.MYPAGE.MY_COMMENTS,
  },
  {
    id: 'account-deletion',
    label: '회원탈퇴',
    icon: 'UserX',
    href: '#',
    isAction: true,
  },
];

export function Mypage({ className = '' }: MypageProps) {
  const {
    user,
    isLoading,
    isLoggingOut,
    isNicknameModalOpen,
    isAccountDeletionModalOpen,
    statsLoading,
    stats,
    handleNicknameEdit,
    closeNicknameModal,
    handleAccountDeletion,
    handleAccountDeletionConfirm,
    closeAccountDeletionModal,
    handleLogout,
  } = useMypage();

  // 배지 수치 계산 함수
  const getBadgeCount = (itemId: string): number | undefined => {
    if (statsLoading) return undefined;

    switch (itemId) {
      case 'reviews':
        return stats.reviewCount > 0 ? stats.reviewCount : undefined;
      case 'my-posts':
        return stats.postCount > 0 ? stats.postCount : undefined;
      case 'my-comments':
        return stats.commentCount > 0 ? stats.commentCount : undefined;
      default:
        return undefined;
    }
  };

  // 액션 핸들러
  const getActionHandler = (itemId: string) => {
    switch (itemId) {
      case 'logout':
        return handleLogout;
      case 'account-deletion':
        return handleAccountDeletion;
      default:
        return undefined;
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={className}>
      {/* 헤더 */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">마이페이지</h1>
      </div>

      {/* 사용자 프로필 카드 */}
      <ProfileCard
        user={user}
        onProfileEdit={handleNicknameEdit}
      />

      {/* 메뉴 그리드 - 모바일 */}
      <div className="md:hidden grid grid-cols-1 gap-2 mb-8">
        {mypageMenuItemsMobile.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            badgeCount={getBadgeCount(item.id)}
            isLoading={statsLoading}
            onAction={getActionHandler(item.id)}
          />
        ))}
      </div>

      {/* 메뉴 그리드 - 데스크탑 */}
      <div className="hidden md:grid grid-cols-2 gap-4 mb-8">
        {mypageMenuItemsDesktop.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            badgeCount={getBadgeCount(item.id)}
            isLoading={statsLoading}
            onAction={getActionHandler(item.id)}
          />
        ))}
      </div>


      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        isOpen={isNicknameModalOpen}
        onClose={closeNicknameModal}
        currentNickname={user.nickname}
        currentProfileImageUrl={user.profileImageUrl}
        currentName={user.name}
        isLoading={isLoading}
      />

      {/* 회원탈퇴 모달 */}
      <WithdrawModal
        isOpen={isAccountDeletionModalOpen}
        onClose={closeAccountDeletionModal}
        onWithdraw={handleAccountDeletionConfirm}
        isLoading={isLoggingOut}
      />

    </div>
  );
}