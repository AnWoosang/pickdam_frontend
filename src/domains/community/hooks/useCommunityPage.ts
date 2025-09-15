"use client";

import { useCallback, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/domains/auth/store/authStore';
import { PostSort } from '@/domains/community/types/community';
import {
  CommunityPageParams,
  CommunityPageState,
  CommunityQueryParams,
  UpdateCommunityParams,
  COMMUNITY_PAGE_DEFAULTS,
} from '@/domains/community/types/communityPageTypes';
import { usePostsQuery } from '@/domains/community/hooks/usePostQueries';
import { isValidCategoryId, PostCategoryId } from '@/domains/community/types/community';
import { SearchFilterType } from '@/shared/components/SearchBar';
import { BusinessError, createBusinessError } from '@/shared/error/BusinessError';

export const useCommunityPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  // URL 파라미터에서 타입 안전하게 상태 추출
  const state: CommunityPageState = useMemo(() => {
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') as PostSort;
    const query = searchParams.get('query');
    const searchFilter = searchParams.get('searchFilter') as SearchFilterType;
    const page = searchParams.get('page');

    return {
      selectedCategory: (category === 'all' || (category && isValidCategoryId(category))) 
        ? (category as PostCategoryId | 'all') 
        : COMMUNITY_PAGE_DEFAULTS.DEFAULT_CATEGORY,
      sortBy: sortBy || COMMUNITY_PAGE_DEFAULTS.DEFAULT_SORT,
      searchQuery: query || '',
      searchFilter: searchFilter || COMMUNITY_PAGE_DEFAULTS.DEFAULT_SEARCH_FILTER,
      currentPage: page ? parseInt(page, 10) || 1 : COMMUNITY_PAGE_DEFAULTS.DEFAULT_PAGE,
    };
  }, [searchParams]);

  // 검색 타입 매핑 상수
  const SEARCH_TYPE_MAP = useMemo(() => ({
    'title': 'title' as const,
    'titleContent': 'titleContent' as const,
    'author': 'author' as const,
  }), []);
  
  const mapSearchType = useCallback((filter: SearchFilterType): 'title' | 'titleContent' | 'author' => {
    return SEARCH_TYPE_MAP[filter] || 'titleContent';
  }, [SEARCH_TYPE_MAP]);

  // API 쿼리 파라미터로 변환
  const queryParams: CommunityQueryParams = useMemo(() => ({
    category: state.selectedCategory === 'all' ? undefined : state.selectedCategory,
    page: state.currentPage,
    limit: COMMUNITY_PAGE_DEFAULTS.POSTS_PER_PAGE,
    search: state.searchQuery || undefined,
    searchType: mapSearchType(state.searchFilter),
    sortBy: state.sortBy,
  }), [state, mapSearchType]);

  // 에러 핸들러
  const createErrorHandler = useCallback((defaultMessage: string) => 
    (error: unknown): BusinessError => {
      if (error instanceof BusinessError) return error;
      if (error instanceof Error) return createBusinessError.dataProcessing(defaultMessage, error.message);
      return createBusinessError.dataProcessing(defaultMessage);
    }, 
    []
  );

  // 데이터 조회 및 계산된 값들
  const { data, isLoading, error } = usePostsQuery(queryParams);
  
  // 에러 처리
  useEffect(() => {
    if (error) {
      const processedError = createErrorHandler('게시글 목록을 불러오는데 실패했습니다.')(error);
      console.error('Posts query error:', processedError);
      toast.error(processedError.message);
    }
  }, [error, createErrorHandler]);

  const { posts, totalCount, totalPages } = useMemo(() => ({
    posts: data?.data || [],
    totalCount: data?.pagination.total || 0,
    totalPages: data?.pagination.totalPages || 1,
  }), [data]);

  // 새 상태 계산
  const mergeStateWithUpdates = useCallback((updates: Partial<CommunityPageParams>) => ({
    selectedCategory: updates.category || state.selectedCategory,
    sortBy: updates.sortBy || state.sortBy,
    searchQuery: updates.query !== undefined ? updates.query : state.searchQuery,
    searchFilter: updates.searchFilter || state.searchFilter,
    currentPage: updates.page || state.currentPage,
  }), [state]);

  // URL 파라미터 빌드
  const buildSearchParams = useCallback((updatedState: CommunityPageState) => {
    const params = new URLSearchParams();
    
    const paramsToSet = [
      { key: 'category', value: updatedState.selectedCategory, default: COMMUNITY_PAGE_DEFAULTS.DEFAULT_CATEGORY },
      { key: 'sortBy', value: updatedState.sortBy, default: COMMUNITY_PAGE_DEFAULTS.DEFAULT_SORT },
      { key: 'query', value: updatedState.searchQuery, default: '' },
      { key: 'searchFilter', value: updatedState.searchFilter, default: COMMUNITY_PAGE_DEFAULTS.DEFAULT_SEARCH_FILTER },
      { key: 'page', value: updatedState.currentPage?.toString(), default: COMMUNITY_PAGE_DEFAULTS.DEFAULT_PAGE.toString() },
    ];

    paramsToSet.forEach(({ key, value, default: defaultValue }) => {
      if (value && value !== defaultValue) {
        params.set(key, value);
      }
    });

    return params;
  }, []);

  // URL 업데이트 함수
  const updateParams: UpdateCommunityParams = useCallback((updates: Partial<CommunityPageParams>) => {
    const updatedState = mergeStateWithUpdates(updates);
    const searchParams = buildSearchParams(updatedState);
    const newURL = searchParams.toString() ? `/community?${searchParams.toString()}` : '/community';
    
    router.push(newURL, { scroll: false });
  }, [mergeStateWithUpdates, buildSearchParams, router]);

  // 권한 검증
  const canCreatePost = isAuthenticated;
  const canEditPost = useCallback((authorId: string) => 
    isAuthenticated && user?.id === authorId, 
    [isAuthenticated, user]);
  const canLike = isAuthenticated;

  // 이벤트 핸들러들
  const handleCategoryChange = useCallback((category: PostCategoryId | 'all') => {
    updateParams({ category, page: COMMUNITY_PAGE_DEFAULTS.DEFAULT_PAGE });
  }, [updateParams]);

  const handleSortChange = useCallback((sortBy: PostSort) => {
    updateParams({ sortBy, page: COMMUNITY_PAGE_DEFAULTS.DEFAULT_PAGE });
  }, [updateParams]);

  const handleSearch = useCallback((query: string, filter?: SearchFilterType) => {
    updateParams({ 
      query, 
      searchFilter: filter || state.searchFilter, 
      page: COMMUNITY_PAGE_DEFAULTS.DEFAULT_PAGE 
    });
  }, [updateParams, state.searchFilter]);

  const handlePageChange = useCallback((page: number) => {
    updateParams({ page });
  }, [updateParams]);

  return {
    // 상태
    selectedCategory: state.selectedCategory,
    sortBy: state.sortBy,
    searchQuery: state.searchQuery,
    searchFilter: state.searchFilter,
    currentPage: state.currentPage,
    posts,
    totalCount,
    totalPages,
    isLoading,
    hasError: !!error,
    
    // 권한
    canCreatePost,
    canEditPost,
    canLike,
    
    // 핸들러들
    handleCategoryChange,
    handleSortChange,
    handleSearch,
    handlePageChange,
  };
};