/**
 * 통합 라우트 상수 정의
 * 모든 앱의 라우트 경로를 한 곳에서 관리
 */

// 기본 라우트 경로들
export const ROUTES = {
  // 홈
  HOME: '/',
  
  // 인증
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNUP_COMPLETE: '/auth/signup/complete',
    LOGIN: '/auth/login',
    CALLBACK: '/auth/callback',
    VERIFY: '/auth/verify',
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // 상품
  PRODUCT: {
    LIST: '/product/list',
    DETAIL: (id: string) => `/product/${id}`,
    RECENT: '/product/recent',
  },
  
  // 커뮤니티
  COMMUNITY: {
    LIST: '/community',
    DETAIL: (id: string) => `/community/${id}`,
    WRITE: '/community/write',
  },
  
  // 마이페이지
  MYPAGE: {
    HOME: '/mypage',
    ORDERS: '/mypage/orders',
    MY_POSTS: '/mypage/my-posts',
    MY_COMMENTS: '/mypage/my-comments',
    LIKED_POSTS: '/mypage/liked-posts',
    LIKED_COMMENTS: '/mypage/liked-comments',
  },
  
  // 기타 페이지
  EVENTS: '/events',
  LIQUID_FINDER: '/liquid-finder',
  
  // 검색
  SEARCH: '/search',
  
  // 정책 페이지
  TERMS: '/terms',
  PRIVACY: '/privacy',
  MARKETING: '/marketing',
} as const;
