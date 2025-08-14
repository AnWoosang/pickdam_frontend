'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Post, PostSearchParams } from '@/types/community';
import { mockPosts } from '@/constants/post-mock-data';
import { PostCard } from './PostCard';
import { InfiniteScroll } from './InfiniteScroll';
import { SearchBar, SearchFilterType } from '@/components/common/SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { SortSelect, SortBy } from './SortSelect';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';

export function CommunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 상태 관리
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [allFilteredPosts, setAllFilteredPosts] = useState<Post[]>([]);
  
  // URL 파라미터에서 초기값 설정
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [sortBy, setSortBy] = useState<SortBy>(
    (searchParams.get('sortBy') as SortBy) || 'latest'
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('query') || ''
  );
  const [searchFilter, setSearchFilter] = useState<SearchFilterType>(
    (searchParams.get('searchFilter') as SearchFilterType) || 'title'
  );


  // 초기 게시글 로드
  const loadInitialPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock 응답 시뮬레이션 (로딩 효과)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 초기 로드 시 URL 파라미터 기반으로 필터링
      let filteredPosts = [...mockPosts];
      
      // 초기 카테고리 필터링
      const initialCategory = searchParams.get('category') || 'all';
      if (initialCategory && initialCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
          post.category?.id === initialCategory
        );
      }
      
      // 초기 검색 필터링
      const initialQuery = searchParams.get('query') || '';
      const initialFilter = (searchParams.get('searchFilter') as SearchFilterType) || 'title';
      if (initialQuery) {
        const query = initialQuery.toLowerCase();
        filteredPosts = filteredPosts.filter(post => {
          switch (initialFilter) {
            case 'title':
              return post.title.toLowerCase().includes(query);
            case 'titleContent':
              return (
                post.title.toLowerCase().includes(query) ||
                post.content?.toLowerCase().includes(query)
              );
            case 'author':
              return post.author.toLowerCase().includes(query);
            default:
              return (
                post.title.toLowerCase().includes(query) ||
                post.content?.toLowerCase().includes(query) ||
                post.author.toLowerCase().includes(query)
              );
          }
        });
      }
      
      // 초기 정렬
      const initialSort = (searchParams.get('sortBy') as SortBy) || 'latest';
      switch (initialSort) {
        case 'popular':
          filteredPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
          break;
        case 'most_viewed':
          filteredPosts.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
          break;
        case 'most_liked':
          filteredPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
          break;
        case 'latest':
        default:
          filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
      
      const limit = 10; // 한 번에 로드할 게시글 수
      const initialPosts = filteredPosts.slice(0, limit);
      
      setAllFilteredPosts(filteredPosts);
      setPosts(initialPosts);
      setTotal(filteredPosts.length);
      setHasMore(filteredPosts.length > limit);
    } catch {
      setError('게시글을 불러오는데 실패했습니다.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]); // searchParams만 의존성으로 사용

  // 추가 게시글 로드
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      // Mock 응답 시뮬레이션 (로딩 효과)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const limit = 10;
      const currentLength = posts.length;
      const nextPosts = allFilteredPosts.slice(currentLength, currentLength + limit);
      
      setPosts(prev => [...prev, ...nextPosts]);
      setHasMore(currentLength + nextPosts.length < allFilteredPosts.length);
    } catch {
      setError('추가 게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, posts.length, allFilteredPosts]);

  // URL 업데이트 함수
  const updateURL = useCallback((params: Partial<PostSearchParams>) => {
    const newSearchParams = new URLSearchParams();
    
    if (params.category !== 'all') {
      newSearchParams.set('category', params.category || selectedCategory);
    }
    if (params.sortBy !== 'latest') {
      newSearchParams.set('sortBy', params.sortBy || sortBy);
    }
    if (params.query) {
      newSearchParams.set('query', params.query);
    }
    if (params.searchFilter && params.searchFilter !== 'title') {
      newSearchParams.set('searchFilter', params.searchFilter);
    }
    
    const newURL = newSearchParams.toString() ? 
      `/community?${newSearchParams.toString()}` : 
      '/community';
      
    router.push(newURL, { scroll: false });
  }, [selectedCategory, sortBy, router]);

  // 초기 데이터 로드 (한 번만)
  useEffect(() => {
    loadInitialPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의존성 배열을 비워서 컴포넌트 마운트 시에만 실행

  // 이벤트 핸들러들
  const handlePostClick = (postId: string) => {
    router.push(`/community/${postId}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateURL({ category });
    
    // 즉시 필터링된 데이터 적용 (로딩 없이)
    let filteredPosts = [...mockPosts];
    
    // 카테고리 필터링 (새로운 카테고리값 사용)
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => 
        post.category?.id === category
      );
    }
    
    // 검색 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post => {
        switch (searchFilter) {
          case 'title':
            return post.title.toLowerCase().includes(query);
          case 'titleContent':
            return (
              post.title.toLowerCase().includes(query) ||
              post.content?.toLowerCase().includes(query)
            );
          case 'author':
            return post.author.toLowerCase().includes(query);
          default:
            return (
              post.title.toLowerCase().includes(query) ||
              post.content?.toLowerCase().includes(query) ||
              post.author.toLowerCase().includes(query)
            );
        }
      });
    }
    
    // 정렬
    switch (sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      case 'most_viewed':
        filteredPosts.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'most_liked':
        filteredPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      case 'latest':
      default:
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    const limit = 10;
    const initialPosts = filteredPosts.slice(0, limit);
    
    setAllFilteredPosts(filteredPosts);
    setPosts(initialPosts);
    setTotal(filteredPosts.length);
    setHasMore(filteredPosts.length > limit);
  };

  const handleSortChange = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
    updateURL({ sortBy: newSortBy });
    
    // 즉시 정렬된 데이터 적용 (로딩 없이)
    let filteredPosts = [...mockPosts];
    
    // 카테고리 필터링
    if (selectedCategory && selectedCategory !== 'all') {
      filteredPosts = filteredPosts.filter(post => 
        post.category?.id === selectedCategory
      );
    }
    
    // 검색 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post => {
        switch (searchFilter) {
          case 'title':
            return post.title.toLowerCase().includes(query);
          case 'titleContent':
            return (
              post.title.toLowerCase().includes(query) ||
              post.content?.toLowerCase().includes(query)
            );
          case 'author':
            return post.author.toLowerCase().includes(query);
          default:
            return (
              post.title.toLowerCase().includes(query) ||
              post.content?.toLowerCase().includes(query) ||
              post.author.toLowerCase().includes(query)
            );
        }
      });
    }
    
    // 정렬 (새로운 정렬값 사용)
    switch (newSortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      case 'most_viewed':
        filteredPosts.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'most_liked':
        filteredPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      case 'latest':
      default:
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    const limit = 10;
    const initialPosts = filteredPosts.slice(0, limit);
    
    setAllFilteredPosts(filteredPosts);
    setPosts(initialPosts);
    setTotal(filteredPosts.length);
    setHasMore(filteredPosts.length > limit);
  };

  const handleSearch = (query: string, filter?: SearchFilterType) => {
    const newSearchQuery = query;
    const newSearchFilter = filter || searchFilter;
    
    setSearchQuery(newSearchQuery);
    if (filter) {
      setSearchFilter(filter);
    }
    updateURL({ query, searchFilter: filter || searchFilter });
    
    // 즉시 검색된 데이터 적용 (로딩 없이)
    let filteredPosts = [...mockPosts];
    
    // 카테고리 필터링
    if (selectedCategory && selectedCategory !== 'all') {
      filteredPosts = filteredPosts.filter(post => 
        post.category?.id === selectedCategory
      );
    }
    
    // 검색 필터링 (새로운 검색값 사용)
    if (newSearchQuery) {
      const queryLower = newSearchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post => {
        switch (newSearchFilter) {
          case 'title':
            return post.title.toLowerCase().includes(queryLower);
          case 'titleContent':
            return (
              post.title.toLowerCase().includes(queryLower) ||
              post.content?.toLowerCase().includes(queryLower)
            );
          case 'author':
            return post.author.toLowerCase().includes(queryLower);
          default:
            return (
              post.title.toLowerCase().includes(queryLower) ||
              post.content?.toLowerCase().includes(queryLower) ||
              post.author.toLowerCase().includes(queryLower)
            );
        }
      });
    }
    
    // 정렬
    switch (sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      case 'most_viewed':
        filteredPosts.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'most_liked':
        filteredPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      case 'latest':
      default:
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    const limit = 10;
    const initialPosts = filteredPosts.slice(0, limit);
    
    setAllFilteredPosts(filteredPosts);
    setPosts(initialPosts);
    setTotal(filteredPosts.length);
    setHasMore(filteredPosts.length > limit);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return `${days}일 전`;
    } else if (hours > 0) {
      return `${hours}시간 전`;
    } else {
      return '방금 전';
    }
  };

  const handleRetry = () => {
    loadInitialPosts();
  };

  const getEmptyMessage = () => {
    if (searchQuery) {
      const filterText = searchFilter === 'title' ? '제목' : 
                        searchFilter === 'titleContent' ? '제목+내용' : '작성자';
      return `${filterText}에서 "${searchQuery}"에 대한 검색 결과가 없습니다.`;
    }
    return '게시글이 없습니다.';
  };

  return (
    <div className="py-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">커뮤니티 게시판</h1>
          {!loading && (
            <p className="text-sm text-gray-600 mt-1">
              총 {total.toLocaleString()}개의 게시글
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
        <Link
          href="/community/write"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          ✏️ 글쓰기
        </Link>
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
      {loading && <LoadingSpinner />}

      {/* 에러 상태 */}
      {error && (
        <ErrorMessage 
          message={error}
          onRetry={handleRetry}
        />
      )}

      {/* 게시글 목록 - 무한스크롤 */}
      {!error && (
        <InfiniteScroll
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMorePosts}
        >
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onPostClick={handlePostClick}
                  formatDate={formatDate}
                />
              ))
            ) : (
              !loading && <EmptyState message={getEmptyMessage()} />
            )}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}