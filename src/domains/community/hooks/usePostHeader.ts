"use client";

import { Post } from '@/domains/community/types/community';

import { useCallback } from 'react';
import { User } from '@/domains/user/types/user';
import { useUIStore } from '@/domains/auth/store/authStore';

interface UsePostHeaderProps {
  post: Post;
  user: User | null;
  onPostDelete?: () => void;
}

export const usePostHeader = ({ post, user, onPostDelete }: UsePostHeaderProps) => {
  const { showToast } = useUIStore();

  // 작성자 확인
  const isOwner = user && (user.id === post.authorId);

  // 삭제 확인 핸들러
  const handleConfirmDelete = useCallback(() => {
    onPostDelete?.();
  }, [onPostDelete]);

  // 공유 핸들러
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = post?.title || '게시글';

    // Web Share API 사용 가능한 경우
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // 사용자가 취소한 경우 아무것도 하지 않음
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        // 공유 실패 시 클립보드로 대체하고 에러 throw
        throw new Error('공유에 실패했습니다.');
      }
    }

    // 클립보드 복사
    try {
      await navigator.clipboard.writeText(url);
      showToast('링크가 클립보드에 복사되었습니다.', 'success');
    } catch {
      // 클립보드 실패 시 수동 복사
      const userCopied = prompt('다음 링크를 복사하세요:', url);
      if (userCopied !== null) {
        showToast('링크를 수동으로 복사해주세요.', 'info');
      }
      throw new Error('클립보드 복사에 실패했습니다.');
    }
  }, [post?.title, showToast]);

  return {
    // 상태
    isOwner,
    // 핸들러
    handleConfirmDelete,
    handleShare,
  };
};