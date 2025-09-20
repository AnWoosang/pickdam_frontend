/**
 * API 엔드포인트 라우트 상수 정의
 * Next.js API routes 경로를 한 곳에서 관리
 */

// API 라우트 경로들 (baseURL이 '/api'이므로 여기서는 '/api' 제외)
export const API_ROUTES = {
  // 상품 API
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    REVIEWS: (id: string) => `/products/${id}/reviews`,
    POPULAR: '/products/popular',
    BESTSELLERS: '/products/bestsellers',
    VIEW: (id: string) => `/products/${id}/view`,
    PRICE_HISTORY: (id: string) => `/products/${id}/price-history`,
  },
  
  // 커뮤니티 API
  COMMUNITY: {
    POSTS: '/community/posts',
    POST_DETAIL: (id: string) => `/community/posts/${id}`,
    POST_LIKE: (id: string) => `/community/posts/${id}/like`,
    POST_VIEW: (id: string) => `/community/posts/${id}/view`,
    POPULAR: '/community/posts/popular',
    COMMENTS: '/community/comments',
    COMMENT_DETAIL: (id: string) => `/community/comments/${id}`,
    COMMENT_LIKE: (id: string) => `/community/comments/${id}/like`,
    COMMENT_REPLIES: (id: string) => `/community/comments/${id}/replies`,
  },
  
  // 인증 API
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    SIGNUP: '/auth/signup',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_EMAIL: '/auth/resend-email',
  },
  
  // 사용자 API
  USERS: {
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: (id: string) => `/users/${id}/profile`,
    WISHLIST: (id: string) => `/users/${id}/wishlist`,
    WISHLIST_TOGGLE: (memberId: string, productId: string) => `/users/${memberId}/wishlist/${productId}`,
    WISHLIST_STATUS: (memberId: string, productId: string) => `/users/${memberId}/wishlist/${productId}/status`,
    MY_REVIEWS: (id: string) => `/users/${id}/my-reviews`,
    MY_COMMENTS: (id: string) => `/users/${id}/my-comments`,
    MY_POSTS: (id: string) => `/users/${id}/my-posts`,
    LIKED_POSTS: (id: string) => `/users/${id}/liked-posts`,
    LIKED_COMMENTS: (id: string) => `/users/${id}/liked-comments`,
    STATS: (id: string) => `/users/${id}/stats`,
    CHECK_NICKNAME: '/users/check-nickname',
    CHECK_EMAIL: '/users/check-email',
    DELETE: (id: string) => `/users/${id}/delete`,
    UPDATE_ROLE: (id: string) => `/users/${id}/role`,
  },
  
  // 리뷰 API
  REVIEWS: {
    DETAIL: (id: string) => `/reviews/${id}`,
  },
  
  // 파일 업로드 API
  UPLOAD_IMAGE: '/upload-image',
} as const;