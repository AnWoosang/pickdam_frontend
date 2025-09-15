// 멘션 관련 유틸리티 함수들

export interface MentionMatch {
  username: string;
  startIndex: number;
  endIndex: number;
}

/**
 * 텍스트에서 @username 패턴을 찾아 반환
 */
export function findMentions(text: string): MentionMatch[] {
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

/**
 * 텍스트의 멘션을 HTML로 변환 (React에서 사용하기 위해)
 */
export function renderMentionsAsHtml(text: string): string {
  const mentionRegex = /@(\w+)/g;
  return text.replace(mentionRegex, '<span class="mention">@$1</span>');
}

/**
 * 텍스트의 멘션을 React 컴포넌트 요소로 분할
 */
export function splitTextWithMentions(text: string): Array<{
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
    // 멘션 이전의 텍스트 추가
    if (mention.startIndex > currentIndex) {
      parts.push({
        type: 'text',
        content: text.substring(currentIndex, mention.startIndex),
      });
    }

    // 멘션 추가
    parts.push({
      type: 'mention',
      content: `@${mention.username}`,
      username: mention.username,
    });

    currentIndex = mention.endIndex;
  });

  // 마지막 텍스트 추가
  if (currentIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(currentIndex),
    });
  }

  return parts;
}

/**
 * 댓글 작성 시 멘션이 포함된 텍스트 생성
 */
export function createReplyWithMention(
  targetUsername: string, 
  content: string
): string {
  const trimmedContent = content.trim();
  const mentionText = `@${targetUsername}`;
  
  // 이미 해당 멘션으로 시작하는지 확인
  if (trimmedContent.startsWith(mentionText)) {
    return trimmedContent;
  }
  
  // 멘션 추가
  return trimmedContent ? `${mentionText} ${trimmedContent}` : mentionText;
}