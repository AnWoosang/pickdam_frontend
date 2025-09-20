"use client";

import { usePostQuery } from '@/domains/community/hooks/usePostQueries';
import { useDeletePostMutation, useIncrementPostViewMutation } from '@/domains/community/hooks/usePostQueries';

import { useEffect, useCallback, useMemo } from 'react';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { BusinessError, createBusinessError } from '@/shared/error/BusinessError';

interface UsePostDetailPageProps {
  postId: string;
}

export const usePostDetailPage = ({ postId }: UsePostDetailPageProps) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthUtils();

  // 에러 핸들러
  const createErrorHandler = useCallback((defaultMessage: string) => 
    (error: unknown): BusinessError => {
      if (error instanceof BusinessError) return error;
      if (error instanceof Error) return createBusinessError.dataProcessing(defaultMessage, error.message);
      return createBusinessError.dataProcessing(defaultMessage);
    }, 
    []
  );

  // React Query 훅들
  const { data: post, isLoading: loading, error: queryError } = usePostQuery(postId);
  const deletePostMutation = useDeletePostMutation();
  const incrementViewMutation = useIncrementPostViewMutation();
  


  // 권한 검증 (memoized)
  const isOwner = useMemo(() => 
    Boolean(isAuthenticated && user && post && user.id === post.authorId),
    [isAuthenticated, user, post]
  );

  
  // 조회수 증가 (세션 기반)
  useEffect(() => {
    if (!postId || !post || authLoading) {
      return;
    }

    const viewKey = `post_view_${postId}`;

    // 이미 조회한 게시글인지 확인 (직접 sessionStorage 접근)
    if (typeof window !== 'undefined' && sessionStorage.getItem(viewKey)) {
      return;
    }

    incrementViewMutation.mutate(
      { id: postId },
      {
        onSuccess: () => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(viewKey, 'true');
          }
        }
      }
    );
  }, [postId, post, authLoading]);


  // 게시글 삭제 핸들러
  const deletePost = useCallback(({ 
    onSuccess, 
    onError 
  }: { 
    onSuccess?: () => void; 
    onError?: (error: BusinessError) => void; 
  } = {}) => {
    // user 체크 제거 - 서버에서 401 응답 시 자동으로 로그인 모달이 뜸
    deletePostMutation.mutate(
      { id: postId, authorId: user?.id || '' },
      {
        onSuccess,
        onError: (error) => {
          const processedError = createErrorHandler('게시글 삭제에 실패했습니다.')(error);
          onError?.(processedError);
        }
      }
    );
  }, [postId, user?.id, deletePostMutation, createErrorHandler]);

  return {
    // 상태
    post,
    loading,
    hasError: !!queryError,
    isOwner,
    isAuthenticated,
    user,
    
    // 액션들
    deletePost,
    
    // 로딩 상태
    isDeleting: deletePostMutation.isPending,
  };
};