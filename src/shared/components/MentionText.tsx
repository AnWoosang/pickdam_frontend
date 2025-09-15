import React from 'react';
import { splitTextWithMentions } from '@/utils/mentionUtils';

interface MentionTextProps {
  text: string;
  className?: string;
  onMentionClick?: (username: string) => void;
}

export function MentionText({ text, className = '', onMentionClick }: MentionTextProps) {
  const parts = splitTextWithMentions(text);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === 'mention' && part.username) {
          return (
            <span
              key={index}
              className={`mention ${
                onMentionClick ? 'cursor-pointer hover:underline' : ''
              }`}
              style={{
                color: '#1d9bf0',
                fontWeight: '500',
              }}
              onClick={() => onMentionClick?.(part.username!)}
            >
              {part.content}
            </span>
          );
        }
        
        return (
          <span key={index}>
            {part.content}
          </span>
        );
      })}
    </span>
  );
}