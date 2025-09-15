'use client';

import { Comment } from '@/domains/community/types/community';

import React, { useState, useCallback } from 'react';
import { Button } from '@/shared/components/Button';
import { Avatar } from '@/shared/components/Avatar';
import { formatAbsoluteDate } from '@/utils/dateUtils';

interface CommentHeaderProps {
  comment: Comment;
  isOwner: boolean;
  onEdit: (content: string) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const CommentHeader = React.memo(({
  comment,
  isOwner,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting
}: CommentHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEdit = useCallback(() => {
    if (isEditing) {
      if (!editedContent.trim()) {
        alert('내용을 입력해주세요.');
        return;
      }
      
      onEdit(editedContent.trim());
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [isEditing, editedContent, onEdit]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedContent(comment.content);
  }, [comment.content]);

  return (
    <>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <Avatar
            src={comment.author?.profile_image_url}
            alt={`${comment.author?.nickname || '탈퇴한 사용자'} 프로필 사진`}
            size="small"
          />
          <div>
            <span className="font-medium text-gray-900">
              {comment.author?.nickname || '탈퇴한 사용자'}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {formatAbsoluteDate(comment.createdAt)}
            </span>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="small" 
              onClick={handleEdit} 
              disabled={isUpdating}
            >
              {isEditing ? '저장' : '수정'}
            </Button>
            {isEditing && (
              <Button 
                variant="ghost" 
                size="small" 
                onClick={handleCancelEdit}
              >
                취소
              </Button>
            )}
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="small" 
                onClick={onDelete}
                disabled={isDeleting}
              >
                삭제
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="ml-11 mb-3">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
            disabled={isUpdating}
          />
        </div>
      )}
    </>
  );
});

CommentHeader.displayName = 'CommentHeader';