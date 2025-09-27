'use client';

import { Comment } from '@/domains/community/types/community';
import { useRepliesQuery } from '@/domains/community/hooks/comment/useCommentQueries';

import React, { useState, useCallback } from 'react';
import { Button } from '@/shared/components/Button';

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

  // React Query로 답글 데이터 가져오기 (showReplies가 true일 때만 활성화)
  const {
    data: repliesData,
    isLoading: isLoadingReplies
  } = useRepliesQuery(
    comment.id,
    {
      page: 1,
      limit: 50
    },
    { enabled: showReplies && !isReply }
  );

  const replies = repliesData?.data || [];

  const handleToggleReplies = useCallback(() => {
    setShowReplies(!showReplies);
  }, [showReplies]);

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