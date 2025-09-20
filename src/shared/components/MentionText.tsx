import React from 'react';

interface MentionTextProps {
  text: string;
  className?: string;
  onMentionClick?: (username: string) => void;
}

interface MentionMatch {
  username: string;
  startIndex: number;
  endIndex: number;
}

function findMentions(text: string): MentionMatch[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: MentionMatch[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      username: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return mentions;
}

function splitTextWithMentions(text: string): Array<{
  type: 'text' | 'mention';
  content: string;
  username?: string;
}> {
  const mentions = findMentions(text);

  const parts: Array<{
    type: 'text' | 'mention';
    content: string;
    username?: string;
  }> = [];

  let currentIndex = 0;

  mentions.forEach((mention) => {
    if (mention.startIndex > currentIndex) {
      parts.push({
        type: 'text',
        content: text.substring(currentIndex, mention.startIndex),
      });
    }

    parts.push({
      type: 'mention',
      content: `@${mention.username}`,
      username: mention.username,
    });

    currentIndex = mention.endIndex;
  });

  if (currentIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(currentIndex),
    });
  }

  return parts;
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