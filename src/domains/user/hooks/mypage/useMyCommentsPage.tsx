'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useMyComments } from './useMyPageQueries';
import { ROUTES } from '@/app/router/routes';
import { toast } from 'react-hot-toast';

export function useMyCommentsPage() {
  const router = useRouter();
  const { user } = useAuthUtils();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  const { data: commentsData, isLoading, error } = useMyComments(
    user?.id || '', 
    currentPage, 
    limit
  );

  const comments = useMemo(() => commentsData?.data || [], [commentsData?.data]);
  const totalCount = useMemo(() => commentsData?.pagination?.total || 0, [commentsData?.pagination?.total]);
  const totalPages = useMemo(() => commentsData?.pagination?.totalPages || 0, [commentsData?.pagination?.totalPages]);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateToCommunity = useCallback(() => {
    router.push(ROUTES.COMMUNITY.LIST);
  }, [router]);

  useEffect(() => {
    if (error) {
      toast.error('내가 쓴 댓글을 불러오는데 실패했습니다.');
    }
  }, [error]);

  return {
    comments,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePageChange,
    handleNavigateToCommunity
  };
}