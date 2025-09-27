'use client';

import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { MentionText } from '@/shared/components/MentionText';

interface CommentContentProps {
  content: string;
  isEditing?: boolean;
}

export const CommentContent = React.memo(({
  content,
  isEditing = false
}: CommentContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowExpandButton, setShouldShowExpandButton] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // 콘텐츠가 200자를 넘는지 확인
  React.useEffect(() => {
    const isLongContent = content.length > 200;
    setShouldShowExpandButton(isLongContent);
  }, [content]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  if (isEditing) {
    return null; // 편집 모드는 CommentHeader에서 처리
  }

  const displayContent = shouldShowExpandButton && !isExpanded
    ? content.slice(0, 200) + '...'
    : content;

  return (
    <div className="ml-11 mb-3">
      <div ref={contentRef}>
        <MentionText
          text={displayContent}
          className="text-gray-700 whitespace-pre-wrap"
        />
      </div>

      {shouldShowExpandButton && (
        <Button
          variant="ghost"
          size="small"
          onClick={toggleExpand}
          className="mt-2 text-primary hover:text-primary-dark"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              접기
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              더보기
            </>
          )}
        </Button>
      )}
    </div>
  );
});

CommentContent.displayName = 'CommentContent';