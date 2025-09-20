'use client';

import { Comment } from '@/domains/community/types/community';
import { useRepliesQuery } from '@/domains/community/hooks/comment/useCommentQueries';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/shared/components/Button';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';

interface CommentCardProps {
  comment: Comment;
  onUpdate: () => void;
  postId: string;
  isReply: boolean;
  rootCommentId?: string;
}

interface CommentReplyListProps {
  comment: Comment;
  postId: string;
  isReply: boolean;
  onUpdate: () => void;
  CommentCard: React.ComponentType<CommentCardProps>; // 순환 참조 방지를 위한 prop
}

export const CommentReplyList = React.memo(({
  comment,
  postId,
  isReply,
  onUpdate,
  CommentCard
}: CommentReplyListProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const { user } = useAuthUtils();

  // React Query로 답글 데이터 가져오기 (showReplies가 true일 때만 활성화)
  const {
    data: repliesData,
    isLoading: isLoadingReplies
  } = useRepliesQuery(
    comment.id,
    {
      page: 1,
      limit: 50,
      currentUserId: user?.id
    },
    { enabled: showReplies && !isReply }
  );

  const replies = repliesData?.data || [];

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log('[DEBUG CommentReplyList] Comment ID:', comment.id, 'showReplies:', showReplies, 'replies count:', replies.length, 'isLoading:', isLoadingReplies);
  }, [comment.id, showReplies, replies.length, isLoadingReplies]);

  const handleToggleReplies = useCallback(() => {
    console.log('[DEBUG CommentReplyList] Toggling replies for comment:', comment.id, 'current showReplies:', showReplies);
    setShowReplies(!showReplies);
  }, [comment.id, showReplies]);

  return (
    <>
      {/* 답글 개수 표시 및 답글 보기/숨기기 */}
      {!isReply && comment.replyCount !== undefined && comment.replyCount > 0 && (
        <div className="ml-11 mt-2">
          <Button 
            variant="ghost" 
            size="small"
            onClick={handleToggleReplies}
            disabled={isLoadingReplies}
            className="text-blue-600 hover:text-blue-700"
          >
            {isLoadingReplies 
              ? '로딩...' 
              : showReplies 
                ? '답글 숨기기' 
                : `답글 ${comment.replyCount}개 보기`
            }
          </Button>
        </div>
      )}
      
      {/* 답글 목록 */}
      {showReplies && replies.length > 0 && !isReply && (
        <div className="mt-3">
          {replies.map((reply: Comment) => (
            <div key={reply.id} className="flex gap-3 ml-8">
              <div className="flex-shrink-0 mt-1">
                <span className="text-gray-400 text-sm">↳</span>
              </div>
              <div className="flex-1">
                <CommentCard
                  comment={reply}
                  onUpdate={onUpdate}
                  postId={postId}
                  isReply={true}
                  rootCommentId={comment.id}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
});

CommentReplyList.displayName = 'CommentReplyList';