'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/domains/auth/store/authStore';
import { useMyPosts } from './useMyPageQueries';
import { ROUTES } from '@/app/router/routes';
import { toast } from 'react-hot-toast';

export function useMyPostsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  const { data: postsData, isLoading, error } = useMyPosts(
    user?.id || '', 
    currentPage, 
    limit
  );

  const myPosts = useMemo(() => postsData?.data || [], [postsData?.data]);
  const totalCount = useMemo(() => postsData?.pagination?.total || 0, [postsData?.pagination?.total]);
  const totalPages = useMemo(() => postsData?.pagination?.totalPages || 0, [postsData?.pagination?.totalPages]);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleWritePost = useCallback(() => {
    router.push(ROUTES.COMMUNITY.WRITE);
  }, [router]);

  useEffect(() => {
    if (error) {
      toast.error('내가 쓴 게시글을 불러오는데 실패했습니다.');
    }
  }, [error]);

  return {
    myPosts: myPosts,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePageChange,
    handleWritePost
  };
}