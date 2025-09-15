'use client';

import React from 'react';
import { Edit3 } from 'lucide-react';
import { useMyPostsPage } from '@/domains/user/hooks/mypage/useMyPostsPage';
import { MyPostCard } from '@/domains/user/components/mypage/MyPostCard';
import { MypageLayout } from '@/domains/user/components/mypage/MypageLayout';
import { Button } from '@/shared/components/Button';

export function MyPostsPage() {
  const {
    myPosts,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePageChange,
    handleWritePost
  } = useMyPostsPage();

  return (
    <MypageLayout
      title="내가 쓴 게시글"
      totalCount={totalCount}
      isLoading={isLoading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    >
      {/* 게시글 목록 */}
      {myPosts.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Edit3 className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            작성한 게시글이 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            첫 번째 게시글을 작성해보세요!
          </p>
          <Button
            variant="primary"
            size="large"
            icon={<Edit3 className="w-4 h-4" />}
            onClick={handleWritePost}
          >
            게시글 작성하기
          </Button>
        </div>
      ) : (
        myPosts.map((myPost) => (
          <MyPostCard
            key={myPost.id}
            post={myPost}
            showContent={false}
          />
        ))
      )}
    </MypageLayout>
  );
}