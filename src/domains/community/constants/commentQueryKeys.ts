interface CommentQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
}

export const commentQueryKeys = {
  all: ['comments'] as const,
  lists: () => [...commentQueryKeys.all, 'list'] as const,
  list: (postId: string, options?: CommentQueryOptions) => [...commentQueryKeys.lists(), postId, options] as const,
  myComments: (userId: string) => [...commentQueryKeys.all, 'my', userId] as const,
} as const;