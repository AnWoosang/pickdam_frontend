"use client";

import { useCommentsQuery } from '@/domains/community/hooks/comment/useCommentQueries';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';

import { useState, useCallback, useMemo } from 'react';

interface UseCommentSectionProps {
  postId: string;
  postCommentCount?: number; // 게시글의 전체 댓글+답글 개수
}

// 상수
const COMMENTS_PER_PAGE = 10;

export const useCommentSection = ({ postId, postCommentCount }: UseCommentSectionProps) => {
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);

  // 인증 상태 확인
  const { isLoading: isAuthLoading } = useAuthUtils();

  // Query options 메모이제이션 (인증 상태 확정 후에만 호출)
  const queryOptions = useMemo(() => ({
    page: currentPage,
    limit: COMMENTS_PER_PAGE
  }), [currentPage]);

  // 댓글 데이터 조회 (인증 상태 로딩 완료 후에만 호출)
  const { data: commentsData, isLoading, error } = useCommentsQuery(postId, queryOptions, {
    enabled: !!postId && !isAuthLoading  // 인증 확인 완료 후에만 호출
  });

  // 댓글 데이터 추출 (메모이제이션)
  const { comments, totalComments, totalPages } = useMemo(() => ({
    comments: commentsData?.data || [],
    totalComments: postCommentCount ?? commentsData?.pagination.total ?? 0, // 게시글의 전체 댓글+답글 개수 우선 사용
    totalPages: commentsData?.pagination.totalPages || 1,
  }), [commentsData, postCommentCount]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // 댓글 업데이트 핸들러 (페이지 유지)
  const handleCommentUpdate = useCallback(() => {
    // React Query가 자동으로 캐시 업데이트하므로 refetch 불필요
    // 페이지 변경하지 않고 현재 페이지 유지
  }, []);

  return {
    // 데이터
    comments,
    totalComments,
    totalPages,
    isLoading,
    currentPage,
    queryError: !!error,

    // 핸들러
    handlePageChange,
    handleCommentUpdate
  };
};
