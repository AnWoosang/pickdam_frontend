"use client";

import { usePostQuery } from '@/domains/community/hooks/usePostQueries';
import { useDeletePostMutation, useIncrementPostViewMutation } from '@/domains/community/hooks/usePostQueries';

import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useUIStore } from '@/domains/auth/store/authStore';

interface UsePostDetailPageProps {
  postId: string;
}

export const usePostDetailPage = ({ postId }: UsePostDetailPageProps) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthUtils();
  const { showToast } = useUIStore();
  const viewIncrementedRef = useRef<Set<string>>(new Set());


  // React Query 훅들
  const { data: post, isLoading: loading, error: queryError } = usePostQuery(postId);
  const deletePostMutation = useDeletePostMutation();
  const incrementViewMutation = useIncrementPostViewMutation();

  // 권한 검증 (memoized)
  const isOwner = useMemo(() => 
    Boolean(isAuthenticated && user && post && user.id === post.authorId),
    [isAuthenticated, user, post]
  );
  
  // 조회수 증가 (세션 기반 + ref 기반 중복 방지)
  useEffect(() => {
    if (!postId || !post || authLoading) {
      return;
    }

    const viewKey = `post_view_${postId}`;

    // 1. 현재 세션에서 이미 호출했는지 확인 (ref 기반)
    if (viewIncrementedRef.current.has(postId)) {
      return;
    }

    // 2. sessionStorage에서 이미 조회한 게시글인지 확인
    if (typeof window !== 'undefined' && sessionStorage.getItem(viewKey)) {
      viewIncrementedRef.current.add(postId);
      return;
    }

    // 3. mutation 실행 중이면 중단
    if (incrementViewMutation.isPending) {
      return;
    }

    // 즉시 중복 호출 방지 마킹
    viewIncrementedRef.current.add(postId);

    incrementViewMutation.mutate(
      { id: postId },
      {
        onSuccess: () => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(viewKey, 'true');
          }
        },
        onError: () => {
          viewIncrementedRef.current.delete(postId);
        }
      }
    );
  }, [postId, post, authLoading, incrementViewMutation]);


  // 게시글 삭제 핸들러
  const deletePost = useCallback(({
    onSuccess,
    onError
  }: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  } = {}) => {
    deletePostMutation.mutate(
      { id: postId },
      {
        onSuccess: () => {
          showToast('게시글이 삭제되었습니다.', 'success');
          onSuccess?.();
        },
        onError: (error) => {
          showToast('게시글 삭제에 실패했습니다.', 'error');
          onError?.(error);
        }
      }
    );
  }, [postId, deletePostMutation, showToast]);

  return {
    // 상태
    post,
    loading,
    queryError: !!queryError,
    isOwner,
    isAuthenticated,
    user,

    // 액션들
    deletePost,

    // 로딩 상태
    isDeleting: deletePostMutation.isPending,
  };
};