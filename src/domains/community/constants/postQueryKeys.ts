
import { PostsRequestParamDto } from '@/domains/community/types/dto/communityDto';

export const postQueryKeys = {
  all: ['posts'] as const,
  lists: () => [...postQueryKeys.all, 'list'] as const,
  list: (filters: PostsRequestParamDto) => [...postQueryKeys.lists(), filters] as const,
  details: () => [...postQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...postQueryKeys.details(), id] as const,
  myPosts: (userId: string) => [...postQueryKeys.all, 'my', userId] as const,
  postsByCategory: (category: string) => [...postQueryKeys.all, 'category', category] as const,
  popularPosts: () => [...postQueryKeys.all, 'popular'] as const,
  categories: () => [...postQueryKeys.all, 'categories'] as const,
} as const;