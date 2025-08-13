'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/community';
import { mockPosts, mockCategories } from '@/constants/mock-data';

interface CommunityPageProps {
  className?: string;
}

export function CommunityPage({ className = '' }: CommunityPageProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  
  // 필터링된 게시글
  const filteredPosts = mockPosts
    .filter(post => selectedCategory === 'all' || post.category?.id === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.likeCount || 0) - (a.likeCount || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handlePostClick = (postId: string) => {
    router.push(`/community/${postId}`);
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

  const PostCard = React.memo(({ post }: { post: Post }) => (
    <div
      key={post.id}
      onClick={() => handlePostClick(post.id)}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4 transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {post.isPinned && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              📌 공지
            </span>
          )}
          {post.isPopular && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              🔥 인기
            </span>
          )}
          {post.category && (
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
        {post.title}
      </h3>
      
      {post.content && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {post.content}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>{post.author}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            👁️ {post.viewCount || 0}
          </span>
          <span className="flex items-center gap-1">
            ❤️ {post.likeCount || 0}
          </span>
          <span className="flex items-center gap-1">
            💬 {post.commentCount || 0}
          </span>
        </div>
      </div>
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex gap-1 mt-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  ));

  PostCard.displayName = 'PostCard';

  return (
    <div className={`${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          커뮤니티 게시판
        </h1>
        <Link
          href="/community/write"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary transition-colors"
        >
          글쓰기
        </Link>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체
        </button>
        {mockCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === category.id
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: selectedCategory === category.id ? category.color : undefined,
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-gray-600">정렬:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
        </select>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">게시글이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 placeholder */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50">
            이전
          </button>
          <span className="px-3 py-2 bg-primary text-white rounded-md text-sm">1</span>
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50">
            다음
          </button>
        </div>
      </div>
    </div>
  );
}