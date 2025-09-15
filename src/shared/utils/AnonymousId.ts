// 익명 사용자 ID 생성 및 관리
export function getAnonymousId(): string {
  // 서버사이드 렌더링 환경에서는 임시 ID 반환
  if (typeof window === 'undefined') {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  const storageKey = 'pickdam_anonymous_id';
  
  // 기존 ID 확인
  let anonymousId = localStorage.getItem(storageKey);
  
  // 없으면 새로 생성
  if (!anonymousId) {
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(storageKey, anonymousId);
  }
  
  return anonymousId;
}

// 익명 ID 초기화 (로그인 시 호출)
export function clearAnonymousId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pickdam_anonymous_id');
  }
}