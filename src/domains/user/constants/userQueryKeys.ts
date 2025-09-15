// User 도메인 React Query 키 관리

export const userKeys = {
  all: ['user'] as const,
  nicknameCheck: (nickname: string) => [...userKeys.all, 'nickname-check', nickname] as const,
  emailCheck: (email: string) => [...userKeys.all, 'email-check', email] as const,
} as const;

export const wishlistKeys = {
  all: ['wishlist'] as const,
  byUser: (userId: string) => [...wishlistKeys.all, userId] as const,
  byUserPaginated: (userId: string, page: number, limit: number) => [...wishlistKeys.all, userId, 'paginated', page, limit] as const,
  status: (userId: string, productId: string) => [...wishlistKeys.all, userId, 'status', productId] as const,
} as const;

export const myPageKeys = {
  all: ['mypage'] as const,
  wishlist: (userId: string) => [...myPageKeys.all, 'wishlist', userId] as const,
  reviews: (userId: string) => [...myPageKeys.all, 'reviews', userId] as const,
  stats: (userId: string) => [...myPageKeys.all, 'stats', userId] as const,
  myComments: (userId: string, page?: number, limit?: number) => [...myPageKeys.all, 'my-comments', userId, page, limit] as const,
  myPosts: (userId: string, page?: number, limit?: number) => [...myPageKeys.all, 'my-posts', userId, page, limit] as const,
  likedPosts: (userId: string, page?: number, limit?: number) => [...myPageKeys.all, 'liked-posts', userId, page, limit] as const,
  likedComments: (userId: string, page?: number, limit?: number) => [...myPageKeys.all, 'liked-comments', userId, page, limit] as const,
} as const;