import { ROUTES } from './routes';

/**
 * 인증 관련 라우트 설정
 */

// 인증 라우트 헬퍼 함수들
export const getSignupCompleteUrl = (email: string) => 
  `${ROUTES.AUTH.SIGNUP_COMPLETE}?email=${encodeURIComponent(email)}`;

export const getVerifyEmailUrl = (token: string) =>
  `${ROUTES.AUTH.VERIFY_EMAIL}?token=${encodeURIComponent(token)}`;

export type AuthRoute = typeof ROUTES.AUTH[keyof typeof ROUTES.AUTH];
export const AUTH_CONFIG = {
  // 인증 없이 접근 가능한 페이지 (공개 페이지)
  publicRoutes: [
    ROUTES.HOME,
    ROUTES.AUTH.SIGNUP,
    ROUTES.AUTH.SIGNUP_COMPLETE,
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.CALLBACK,
    ROUTES.AUTH.VERIFY,
    ROUTES.AUTH.VERIFY_EMAIL,
    ROUTES.AUTH.RESET_PASSWORD,
    ROUTES.PRODUCT.LIST,
    ROUTES.COMMUNITY.LIST,
    ROUTES.SEARCH,
    ROUTES.EVENTS,
    ROUTES.LIQUID_FINDER,
    ROUTES.TERMS,
    ROUTES.PRIVACY,
    ROUTES.MARKETING,
  ],
  
  // 동적 라우트 패턴들
  publicRoutePatterns: [
    '/products/', // 상품 상세 페이지
    '/community/', // 커뮤니티 조회 페이지
  ],
  
  // 인증이 필요한 페이지 (로그인 필수)
  protectedRoutes: [
    ROUTES.PRODUCT.RECENT,
    ROUTES.COMMUNITY.WRITE,
    ROUTES.MYPAGE.HOME,
    ROUTES.MYPAGE.ORDERS,
    ROUTES.MYPAGE.MY_POSTS,
    ROUTES.MYPAGE.MY_COMMENTS,
    ROUTES.MYPAGE.LIKED_POSTS,
    ROUTES.MYPAGE.LIKED_COMMENTS,
  ],
  
  // 보호된 라우트 패턴들
  protectedRoutePatterns: [
    '/mypage/', // 마이페이지 전체
    '/community/*/edit', // 커뮤니티 수정 페이지
  ],
};

/**
 * 경로가 패턴과 일치하는지 확인
 */
export const matchesRoute = (pathname: string, route: string): boolean => {
  return pathname === route;
};

/**
 * 경로가 패턴 배열과 일치하는지 확인
 */
export const matchesRoutePattern = (pathname: string, pattern: string): boolean => {
  // 와일드카드 패턴 처리
  if (pattern.includes('*')) {
    const regex = new RegExp(pattern.replace(/\*/g, '[^/]+'));
    return regex.test(pathname);
  }
  return pathname.startsWith(pattern);
};

/**
 * 공개 페이지인지 확인
 */
export const isPublicRoute = (pathname: string): boolean => {
  // 정확한 공개 라우트 확인
  const isExactPublicRoute = AUTH_CONFIG.publicRoutes.some(route => matchesRoute(pathname, route));
  
  // 공개 라우트 패턴 확인
  const isPublicRoutePattern = AUTH_CONFIG.publicRoutePatterns.some(pattern => 
    matchesRoutePattern(pathname, pattern)
  );
  
  return isExactPublicRoute || isPublicRoutePattern;
};

/**
 * 보호된 페이지인지 확인
 */
export const isProtectedRoute = (pathname: string): boolean => {
  // 정확한 보호 라우트 확인
  const isExactProtectedRoute = AUTH_CONFIG.protectedRoutes.some(route => matchesRoute(pathname, route));
  
  // 보호 라우트 패턴 확인
  const isProtectedRoutePattern = AUTH_CONFIG.protectedRoutePatterns.some(pattern => 
    matchesRoutePattern(pathname, pattern)
  );
  
  return isExactProtectedRoute || isProtectedRoutePattern;
};
