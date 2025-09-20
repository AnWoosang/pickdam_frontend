'use client';

import React, { useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { ROUTES } from '@/app/router/routes';
import { MyComment } from '@/domains/user/types/mypage';

interface MypageCommentCardProps {
  comment: MyComment;
  variant?: 'myComments' | 'likedComments';
}

export const MypageCommentCard = React.memo(({ 
  comment, 
  variant = 'myComments' 
}: MypageCommentCardProps) => {
  const router = useRouter();

  // MyComment 타입을 직접 사용
  const myComment = useMemo(() => comment, [comment]);

  const handleViewClick = useCallback(() => {
    router.push(`${ROUTES.COMMUNITY.DETAIL(myComment.postId)}#comment-${myComment.id}`);
  }, [router, myComment.postId, myComment.id]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {/* 게시글 정보 */}
      <div className="mb-4 pb-3 border-b border-gray-100">
        <Link
          href={ROUTES.COMMUNITY.DETAIL(myComment.postId)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <span>게시글: {myComment.postTitle}</span>
        </Link>
      </div>

      {/* 댓글 내용 */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed line-clamp-3">
          {myComment.content}
        </p>
      </div>

      {/* 메타 정보 */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          {/* 작성자 (좋아요한 댓글에만 표시) */}
          {variant === 'likedComments' && (
            <span className="font-medium text-gray-700">{myComment.author}</span>
          )}
          
          {/* 날짜 */}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(myComment.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
              })
            }</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span>좋아요 {myComment.likeCount}</span>
          </div>
          <Button
            variant="ghost"
            size="small"
            onClick={handleViewClick}
          >
            보기
          </Button>
        </div>
      </div>
    </div>
  );
});

MypageCommentCard.displayName = 'MypageCommentCard';