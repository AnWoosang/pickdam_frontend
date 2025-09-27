'use client';

import { Post } from '@/domains/community/types/community';

import React from 'react';
import Link from 'next/link';
import { PostCard } from '@/domains/community/components/PostCard';
import { CategoryFilter } from '@/domains/community/components/CategoryFilter';
import { SortSelect } from '@/domains/community/components/SortSelect';
import { useCommunityPage } from '@/domains/community/hooks/useCommunityPage';
import { Pagination } from '@/shared/components/Pagination';
import { SearchBar } from '@/shared/components/SearchBar';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { EmptyState } from '@/shared/components/EmptyState';
import { ROUTES } from '@/app/router/routes';

export function CommunityPage() {
  const {
    // 상태
    selectedCategory,
    sortBy,
    searchQuery,
    searchFilter,
    currentPage,
    posts,
    totalCount,
    totalPages,
    isLoading,
    queryError,
    canCreatePost,
    
    // 핸들러들
    handleCategoryChange,
    handleSortChange,
    handleSearch,
    handlePageChange,
  } = useCommunityPage();

  // UI 로직들 (컴포넌트에서 처리)
  const handlePageChangeWithScroll = (page: number) => {
    handlePageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSearchFilterLabel = (filter: string): string => {
    switch (filter) {
      case 'title': return '제목';
      case 'titleContent': return '제목+내용';
      case 'author': return '작성자';
      default: return '제목+내용';
    }
  };

  return (
    <div className="py-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">커뮤니티 게시판</h1>
          {!isLoading && (
            <p className="text-sm text-gray-600 mt-1">
              총 {totalCount.toLocaleString()}개의 게시글
            </p>
          )}
        </div>
      </div>

      {/* 검색 바와 글쓰기 버튼 */}
      <div className="flex items-center gap-4 mb-6">
        <SearchBar 
          searchQuery={searchQuery}
          searchFilter={searchFilter}
          onSearch={handleSearch}
          placeholder="게시글을 검색하세요..."
          showFilter={true}
          className="flex-1 max-w-md"
        />
        {canCreatePost && (
          <Link
            href={ROUTES.COMMUNITY.WRITE}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            ✏️ 글쓰기
          </Link>
        )}
      </div>

      {/* 필터 및 정렬 */}
      <div className="flex items-center gap-20 mb-2 mt-10">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <SortSelect 
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
      </div>

      {/* 로딩 상태 */}
      {isLoading && <LoadingSpinner />}

      {/* 에러 상태 */}
      {queryError && (
        <ErrorMessage 
          message="게시글을 불러오는데 실패했습니다. 잠시 후 다시 실행해주세요."
          onRetry={() => window.location.reload()}
        />
      )}

      {/* 게시글 목록 */}
      {!queryError && (
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post: Post, index: number) => (
              <PostCard 
                key={`${post.id}-${index}`} 
                post={post}
              />
            ))
          ) : (
            !isLoading && <EmptyState message={
              searchQuery 
                ? `${getSearchFilterLabel(searchFilter)}에서 "${searchQuery}"에 대한 검색 결과가 없습니다.`
                : '게시글이 없습니다.'
            } />
          )}
        </div>
      )}

      {/* 페이지네이션 */}
      {!queryError && !isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChangeWithScroll}
          showPageNumbers={5}
        />
      )}
    </div>
  );
}