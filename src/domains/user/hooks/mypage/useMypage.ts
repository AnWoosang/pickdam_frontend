'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/domains/auth/store/authStore';
import { useLogout, useRefreshSession } from '@/domains/auth/hooks/useAuthQueries';
import { useUserStats, useDeleteAccount, useUpdateProfile } from './useMyPageQueries';

// 페이지네이션 상수 (비즈니스 로직에서 관리)
const _DEFAULT_PAGE = 1;
const _DEFAULT_PAGE_SIZE = 10;

// API 응답 타입 정의 (snake_case)
interface UserStatsApiResponse {
  wishlist_count: number;
  review_count: number;
  post_count: number;
  comment_count: number;
  liked_posts_count: number;
  liked_comments_count: number;
}

export function useMypage() {
  const { user, isLoading } = useAuthStore();
  const logoutMutation = useLogout();
  const refreshMutation = useRefreshSession();
  const router = useRouter();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isAccountDeletionModalOpen, setIsAccountDeletionModalOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // React Query hooks 사용
  const { data: userStatsData, isLoading: statsLoading } = useUserStats(user?.id || '');
  const updateProfileMutation = useUpdateProfile();
  const deleteAccountMutation = useDeleteAccount();

  // 통계 데이터 변환 - API 응답의 snake_case를 camelCase로 변환
  const statsData = userStatsData as UserStatsApiResponse | undefined;
  const stats = {
    wishlistCount: statsData?.wishlist_count || 0,
    reviewCount: statsData?.review_count || 0,
    postCount: statsData?.post_count || 0,
    commentCount: statsData?.comment_count || 0,
    likedPostsCount: statsData?.liked_posts_count || 0,
    likedCommentsCount: statsData?.liked_comments_count || 0,
  };

  // 로그아웃 다이얼로그 열기
  const handleLogout = useCallback(() => {
    setShowLogoutDialog(true);
  }, []);

  // 로그아웃 확인 처리
  const handleLogoutConfirm = useCallback(async () => {
    setIsLoggingOut(true);
    setShowLogoutDialog(false);
    try {
      await logoutMutation.mutateAsync();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logoutMutation, router]);


  // 닉네임 수정 모달 열기
  const handleNicknameEdit = useCallback(() => {
    setIsNicknameModalOpen(true);
  }, []);

  // 닉네임 저장
  const handleNicknameSave = useCallback(async (newNickname: string) => {
    if (!user) return;
    
    try {
      await updateProfileMutation.mutateAsync({
        userId: user.id,
        updates: { nickname: newNickname }
      });
      await refreshMutation.mutateAsync();
    } catch (error) {
      console.error('닉네임 업데이트 실패:', error);
      throw error;
    }
  }, [user, refreshMutation, updateProfileMutation]);

  // 모달 닫기
  const closeNicknameModal = useCallback(() => {
    setIsNicknameModalOpen(false);
  }, []);

  // 회원탈퇴 모달 열기
  const handleAccountDeletion = useCallback(() => {
    setIsAccountDeletionModalOpen(true);
  }, []);

  // 회원탈퇴 확인
  const handleAccountDeletionConfirm = useCallback(async () => {
    if (!user) return;

    setIsLoggingOut(true);
    try {
      await deleteAccountMutation.mutateAsync({
        userId: user.id,
        reason: '사용자 요청'
      });
      await logoutMutation.mutateAsync();
      router.push('/');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      throw error; // 에러를 다시 throw해서 모달에서 처리하도록
    } finally {
      setIsLoggingOut(false);
    }
  }, [user, logoutMutation, router, deleteAccountMutation]);

  // 회원탈퇴 모달 닫기
  const closeAccountDeletionModal = useCallback(() => {
    setIsAccountDeletionModalOpen(false);
  }, []);

  return {
    // 상태
    user,
    isLoading,
    isLoggingOut,
    isNicknameModalOpen,
    isAccountDeletionModalOpen,
    showLogoutDialog,
    statsLoading,
    stats,
    
    // 액션
    handleLogout,
    handleLogoutConfirm,
    handleNicknameEdit,
    handleNicknameSave,
    closeNicknameModal,
    handleAccountDeletion,
    handleAccountDeletionConfirm,
    closeAccountDeletionModal,
    setShowLogoutDialog,
  };
}