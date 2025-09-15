import { PostSort, PostCategoryId } from './community';
import { SearchFilterType } from '@/shared/components/SearchBar';

// CommunityPage 전용 타입들

// URL 파라미터 타입 (기존 PostSearchParams 개선)
export interface CommunityPageParams {
  category?: PostCategoryId | 'all';
  sortBy?: PostSort;
  query?: string;
  searchFilter?: SearchFilterType;
  page?: number;
}

// URL에서 파싱된 상태 타입 (기본값 적용된)
export interface CommunityPageState {
  selectedCategory: PostCategoryId | 'all';
  sortBy: PostSort;
  searchQuery: string;
  searchFilter: SearchFilterType;
  currentPage: number;
}

// 쿼리 파라미터 변환 타입 (API 호출용)
export interface CommunityQueryParams {
  category?: PostCategoryId;
  page: number;
  limit: number;
  search?: string;
  searchType: 'title' | 'titleContent' | 'author';
  sortBy: PostSort;
}

// URL 업데이트 함수 타입
export type UpdateCommunityParams = (params: Partial<CommunityPageParams>) => void;

// 기본값 상수
export const COMMUNITY_PAGE_DEFAULTS = {
  POSTS_PER_PAGE: 10,
  DEFAULT_CATEGORY: 'all' as const,
  DEFAULT_SORT: 'created_at' as PostSort,
  DEFAULT_SEARCH_FILTER: 'title' as SearchFilterType,
  DEFAULT_PAGE: 1,
} as const;