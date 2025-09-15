'use client';

import React from 'react';
import { ROUTES } from '@/app/router/routes';
import { NicknameEditModal } from '@/domains/user/components/mypage/NicknameEditModal';
import { AccountDeletionModal } from '@/domains/user/components/mypage/AccountDeletionModal';
import { ProfileCard } from '@/domains/user/components/mypage/ProfileCard';
import { MenuItem } from '@/domains/user/components/mypage/MenuItem';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
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

// 메뉴 아이템 설정
const mypageMenuItems: MypageMenuItem[] = [
  {
    id: 'reviews',
    label: '내 리뷰',
    icon: 'FileText',
    href: '/mypage/reviews', // TODO: ROUTES에 추가 필요
  },
  {
    id: 'my-posts',
    label: '내가 쓴 게시글',
    icon: 'Edit3',
    href: ROUTES.MYPAGE.MY_POSTS,
  },
  {
    id: 'my-comments',
    label: '내가 쓴 댓글',
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
  {
    id: 'logout',
    label: '로그아웃',
    icon: 'LogOut',
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
    showLogoutDialog,
    statsLoading,
    stats,
    handleLogout,
    handleLogoutConfirm,
    handleNicknameEdit,
    handleNicknameSave,
    closeNicknameModal,
    handleAccountDeletion,
    handleAccountDeletionConfirm,
    closeAccountDeletionModal,
    setShowLogoutDialog,
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
      case 'liked-posts':
        return stats.likedPostsCount > 0 ? stats.likedPostsCount : undefined;
      case 'liked-comments':
        return stats.likedCommentsCount > 0 ? stats.likedCommentsCount : undefined;
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
      </div>

      {/* 사용자 프로필 카드 */}
      <ProfileCard
        user={user}
        onNicknameEdit={handleNicknameEdit}
      />

      {/* 메뉴 그리드 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {mypageMenuItems.map((item) => (
          <MenuItem 
            key={item.id} 
            item={item} 
            badgeCount={getBadgeCount(item.id)}
            isLoading={statsLoading}
            onAction={item.id === 'account-deletion' ? handleAccountDeletion : item.id === 'logout' ? handleLogout : undefined}
          />
        ))}
      </div>


      {/* 닉네임 수정 모달 */}
      <NicknameEditModal
        isOpen={isNicknameModalOpen}
        onClose={closeNicknameModal}
        onSave={handleNicknameSave}
        currentNickname={user.nickname}
        isLoading={isLoading}
      />

      {/* 회원탈퇴 모달 */}
      <AccountDeletionModal
        isOpen={isAccountDeletionModalOpen}
        onClose={closeAccountDeletionModal}
        onConfirm={handleAccountDeletionConfirm}
        isLoading={isLoggingOut}
      />

      {/* 로그아웃 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogoutConfirm}
        message="정말 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        cancelText="취소"
        confirmButtonColor="red"
        icon="🚪"
      />
    </div>
  );
}