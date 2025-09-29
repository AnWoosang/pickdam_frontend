'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useLogout } from '@/domains/auth/hooks/useAuthQueries';
import { useUserStats, useDeleteAccount } from './useMyPageQueries';
import { WithdrawMemberForm } from '@/domains/user/types/user';
import toast from 'react-hot-toast';

// 페이지네이션 상수 (비즈니스 로직에서 관리)
const _DEFAULT_PAGE = 1;
const _DEFAULT_PAGE_SIZE = 10;

export function useMypage() {
  const { user, isLoading } = useAuthUtils();
  const logoutMutation = useLogout();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isAccountDeletionModalOpen, setIsAccountDeletionModalOpen] = useState(false);

  // React Query hooks 사용
  const { data: userStatsData, isLoading: statsLoading } = useUserStats(user?.id || '');
  const deleteAccountMutation = useDeleteAccount();

  // 통계 데이터 - 이미 도메인 타입으로 변환됨
  const stats = {
    reviewCount: userStatsData?.reviewCount || 0,
    postCount: userStatsData?.postCount || 0,
    commentCount: userStatsData?.commentCount || 0,
  };



  // 닉네임 수정 모달 열기
  const handleNicknameEdit = useCallback(() => {
    setIsNicknameModalOpen(true);
  }, []);


  // 모달 닫기
  const closeNicknameModal = useCallback(() => {
    setIsNicknameModalOpen(false);
  }, []);

  // 회원탈퇴 모달 열기
  const handleAccountDeletion = useCallback(() => {
    setIsAccountDeletionModalOpen(true);
  }, []);

  // 회원탈퇴 확인
  const handleAccountDeletionConfirm = useCallback((form: WithdrawMemberForm): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('User not found'));
        return;
      }

      setIsLoggingOut(true);
      deleteAccountMutation.mutate({
        memberId: user.id,
        requestForm: form
      }, {
        onSuccess: () => {
          toast.success('회원 탈퇴가 완료되었습니다.');
          logoutMutation.mutate(undefined, {
            onSuccess: () => {
              router.push('/');
              resolve();
            },
            onError: () => {
              // 탈퇴는 성공했지만 로그아웃 실패 시에도 홈으로 이동
              router.push('/');
              resolve();
            },
            onSettled: () => {
              setIsLoggingOut(false);
            }
          });
        },
        onError: (error) => {
          toast.error('회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.');
          setIsLoggingOut(false);
          reject(error);
        }
      });
    });
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
    statsLoading,
    stats,

    // 액션
    handleNicknameEdit,
    closeNicknameModal,
    handleAccountDeletion,
    handleAccountDeletionConfirm,
    closeAccountDeletionModal,
  };
}