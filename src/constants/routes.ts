/// 모든 라우트 경로를 상수로 정의
export const RouteNames = {
  home: '/',
  search: '/search',
  productDetail: '/product/[id]',
  productSearch: '/search/products',
  signup: '/signup',
  mypage: '/mypage',
  community: '/community',
  communityPost: '/community/[id]',
} as const;

export class RoutePaths {
  static productDetail(id: string): string {
    return `/product/${id}`;
  }
  
  static communityPost(id: string): string {
    return `/community/${id}`;
  }
}

export type RouteNames = typeof RouteNames[keyof typeof RouteNames];