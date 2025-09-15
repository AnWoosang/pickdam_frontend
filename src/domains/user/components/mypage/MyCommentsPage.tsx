'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useMyCommentsPage } from '@/domains/user/hooks/mypage/useMyCommentsPage';
import { MypageLayout } from '@/domains/user/components/mypage/MypageLayout';
import { MypageCommentCard } from '@/domains/user/components/mypage/MypageCommentCard';
import { Button } from '@/shared/components/Button';
import type { MyComment } from '@/domains/user/types/mypage/mypage';

export function MyCommentsPage() {
  const {
    comments,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePageChange,
    handleNavigateToCommunity
  } = useMyCommentsPage();

  return (
    <MypageLayout
      title="내가 쓴 댓글"
      totalCount={totalCount}
      isLoading={isLoading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    >
      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <MessageSquare className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            작성한 댓글이 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            커뮤니티에 참여해서 첫 댓글을 작성해보세요!
          </p>
          <Button
            variant="primary"
            size="large"
            icon={<MessageSquare className="w-4 h-4" />}
            onClick={handleNavigateToCommunity}
          >
            커뮤니티 둘러보기
          </Button>
        </div>
      ) : (
        comments.map((comment: MyComment) => (
          <MypageCommentCard
            key={comment.id}
            comment={comment}
            variant="myComments"
          />
        ))
      )}
    </MypageLayout>
  );
}