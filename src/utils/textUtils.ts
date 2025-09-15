/**
 * HTML 태그를 제거하고 텍스트만 추출하여 지정된 길이로 자르는 함수
 */
export const truncateHTMLContent = (
  htmlContent: string, 
  maxLength: number = 200
): string => {
  // 서버 사이드 렌더링 호환성 확인
  if (typeof window === 'undefined') {
    // 서버에서는 간단한 정규식으로 처리
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
    const cleanContent = textContent.replace(/\s+/g, ' ').trim();
    return cleanContent.length > maxLength 
      ? cleanContent.substring(0, maxLength) + '...'
      : cleanContent;
  }

  // 클라이언트에서는 DOM API 사용
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  // 줄바꿈을 공백으로 치환하고 불필요한 공백 제거
  const cleanContent = textContent.replace(/\s+/g, ' ').trim();
  
  if (cleanContent.length > maxLength) {
    return cleanContent.substring(0, maxLength) + '...';
  }
  return cleanContent;
};