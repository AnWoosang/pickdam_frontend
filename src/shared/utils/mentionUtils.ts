/**
 * 멘션 관련 유틸리티 함수들
 *
 * 단순화된 댓글 시스템에서 content 파싱을 통한 멘션 기능 제공
 */

/**
 * 텍스트에서 멘션(@username) 패턴을 찾아서 사용자명 배열로 반환
 * @param content - 분석할 텍스트 내용
 * @returns 멘션된 사용자명 배열 (@ 제외)
 */
export const parseMentions = (content: string): string[] => {
  const mentionRegex = /@([a-zA-Z0-9_가-힣]+)/g;
  const matches = content.match(mentionRegex);
  return matches ? matches.map(match => match.slice(1)) : [];
};

/**
 * 텍스트에서 멘션을 HTML span 태그로 변환 (하이라이트용)
 * @param content - 변환할 텍스트 내용
 * @returns 멘션이 하이라이트된 HTML 문자열
 */
export const highlightMentions = (content: string): string => {
  return content.replace(
    /@([a-zA-Z0-9_가-힣]+)/g,
    '<span class="mention">@$1</span>'
  );
};

/**
 * 댓글 작성 시 특정 사용자에게 멘션을 자동으로 삽입
 * @param targetUsername - 멘션할 사용자명
 * @param existingContent - 기존 내용 (선택사항)
 * @returns 멘션이 포함된 텍스트
 */
export const insertMention = (targetUsername: string, existingContent = ''): string => {
  const mentionText = `@${targetUsername} `;

  // 이미 해당 사용자를 멘션하고 있는지 확인
  if (existingContent.includes(`@${targetUsername}`)) {
    return existingContent;
  }

  // 기존 내용이 있으면 앞에 멘션 추가, 없으면 멘션만
  return existingContent ? `${mentionText}${existingContent}` : mentionText;
};

/**
 * 텍스트에서 멘션 개수 반환
 * @param content - 분석할 텍스트 내용
 * @returns 멘션 개수
 */
export const getMentionCount = (content: string): number => {
  return parseMentions(content).length;
};

/**
 * 특정 사용자가 멘션되었는지 확인
 * @param content - 분석할 텍스트 내용
 * @param username - 확인할 사용자명
 * @returns 멘션 여부
 */
export const isMentioned = (content: string, username: string): boolean => {
  const mentions = parseMentions(content);
  return mentions.includes(username);
};

/**
 * 멘션 검증 (유효한 멘션 패턴인지 확인)
 * @param mention - 검증할 멘션 문자열 (@ 포함 또는 제외)
 * @returns 유효한 멘션인지 여부
 */
export const isValidMention = (mention: string): boolean => {
  const cleanMention = mention.startsWith('@') ? mention.slice(1) : mention;
  const validPattern = /^[a-zA-Z0-9_가-힣]+$/;
  return validPattern.test(cleanMention) && cleanMention.length > 0 && cleanMention.length <= 50;
};