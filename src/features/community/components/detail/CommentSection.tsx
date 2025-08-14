'use client';

import React, { useState } from 'react';
import { Comment } from '@/types/community';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

interface CommentCardProps {
  comment: Comment;
  formatDate: (dateString: string) => string;
}

const CommentCard = React.memo(({ comment, formatDate }: CommentCardProps) => (
  <div className="border-b border-gray-100 py-4 last:border-b-0">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {comment.author[0]}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-900">{comment.author}</span>
          <span className="text-sm text-gray-500 ml-2">
            {formatDate(comment.createdAt)}
          </span>
        </div>
      </div>
      <Button variant="ghost" size="small" icon="⋮" noFocus>
        <span className="sr-only">댓글 옵션</span>
      </Button>
    </div>
    
    <p className="text-gray-700 mb-2 ml-11">
      {comment.content}
    </p>
    
    <div className="flex items-center gap-4 ml-11">
      <Button variant="ghost" size="small" icon="❤️">
        {comment.likeCount || 0}
      </Button>
      <Button variant="ghost" size="small">
        답글
      </Button>
    </div>
  </div>
));

CommentCard.displayName = 'CommentCard';

interface CommentSectionProps {
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (e: React.FormEvent) => void;
  formatDate: (dateString: string) => string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  newComment,
  onCommentChange,
  onCommentSubmit,
  formatDate
}) => {
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setShowSubmitDialog(true);
    }
  };

  const handleConfirmSubmit = () => {
    setShowSubmitDialog(false);
    // 원래 onCommentSubmit 호출
    const mockEvent = { preventDefault: () => {} } as React.FormEvent;
    onCommentSubmit(mockEvent);
  };
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        전체 댓글 {comments.length}개
      </h3>

      {/* 댓글 작성 */}
      <form onSubmit={handleSubmitClick} className="mb-2">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">U</span>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="댓글을 작성하세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                variant="primary"
                size="medium"
                disabled={!newComment.trim()}
              >
                등록
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard 
              key={comment.id} 
              comment={comment}
              formatDate={formatDate}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            첫 번째 댓글을 작성해보세요!
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={handleConfirmSubmit}
        message="댓글을 등록하시겠습니까?"
        confirmText="등록"
        cancelText="취소"
        confirmButtonColor="primary"
        icon="✅"
      />
    </div>
  );
};