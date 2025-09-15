"use client";

import { useCommentsQuery } from '@/domains/community/hooks/comment/useCommentQueries';

import { useState, useCallback, useMemo } from 'react';

interface UseCommentSectionProps {
  postId: string;
  currentUserId?: string;
}

// 상수
const COMMENTS_PER_PAGE = 20;

export const useCommentSection = ({ postId, currentUserId }: UseCommentSectionProps) => {
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);

  // Query options 메모이제이션
  const queryOptions = useMemo(() => ({
    page: currentPage,
    limit: COMMENTS_PER_PAGE,
    currentUserId
  }), [currentPage, currentUserId]);

  // 댓글 데이터 조회
  const { data: commentsData, isLoading } = useCommentsQuery(postId, queryOptions);

  // 댓글 데이터 추출 (메모이제이션)
  const { comments, totalComments, totalPages } = useMemo(() => ({
    comments: commentsData?.data || [],
    totalComments: commentsData?.pagination.total || 0,
    totalPages: commentsData?.pagination.totalPages || 1,
  }), [commentsData]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // 댓글 업데이트 핸들러 (댓글 추가 시 첫 페이지로 이동)
  const handleCommentUpdate = useCallback(() => {
    // React Query가 자동으로 캐시 업데이트하므로 refetch 불필요
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage]);

  return {
    // 데이터
    comments,
    totalComments,
    totalPages,
    isLoading,
    currentPage,
    
    // 핸들러
    handlePageChange,
    handleCommentUpdate
  };
};
