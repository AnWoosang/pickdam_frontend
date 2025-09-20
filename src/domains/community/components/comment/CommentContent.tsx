'use client';

import React from 'react';
import { MentionText } from '@/shared/components/MentionText';

interface CommentContentProps {
  content: string;
  isEditing?: boolean;
}

export const CommentContent = React.memo(({
  content,
  isEditing = false
}: CommentContentProps) => {
  if (isEditing) {
    return null; // 편집 모드는 CommentHeader에서 처리
  }

  return (
    <div className="ml-11 mb-3">
      <MentionText 
        text={content} 
        className="text-gray-700"
        onMentionClick={(username) => {
          console.log(`Clicked mention: ${username}`);
        }}
      />
    </div>
  );
});

CommentContent.displayName = 'CommentContent';