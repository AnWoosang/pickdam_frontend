import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, PostDetail, CommentForm, CommentLikeInfo } from '@/domains/community/types/community';
import { commentQueryKeys } from '@/domains/community/constants/commentQueryKeys';
import { postQueryKeys } from '@/domains/community/constants/postQueryKeys';
import {
  getComments,
  getReplies,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike
} from '@/domains/community/api/commentsApi';
import { PaginationResult } from '@/shared/types/pagination';

// 댓글 목록 조회 Hook (통합 버전 - 좋아요 상태 포함)
export const useCommentsQuery = (postId: string, options: {
  page?: number;
  limit?: number;
  currentUserId?: string;
} = {}, queryOptions?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: commentQueryKeys.list(postId, options),
    queryFn: async (): Promise<PaginationResult<Comment>> => {
      return await getComments(postId, options)
    },
    enabled: queryOptions?.enabled !== undefined ? queryOptions.enabled : !!postId,
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 3 * 60 * 1000, // 3분
  })
}

// 댓글 작성 Mutation Hook
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CommentForm): Promise<Comment> => {
      return await createComment(data)
    },
    onSuccess: (newComment, data) => {
      // 답글인 경우와 일반 댓글인 경우 구분
      if (data.parentId) {
        // 답글인 경우: 부모 댓글의 replyCount 업데이트
        queryClient.setQueriesData(
          {
            queryKey: commentQueryKeys.lists(),
            predicate: (query) => {
              const [, , queryPostId] = query.queryKey
              return queryPostId === data.postId
            }
          },
          (oldData: unknown) => {
            if (!oldData) return oldData
            const cachedData = oldData as PaginationResult<Comment>
            return {
              ...cachedData,
              data: cachedData.data.map(comment =>
                comment.id === data.parentId
                  ? { ...comment, replyCount: (comment.replyCount || 0) + 1 }
                  : comment
              )
            }
          }
        )

        // 답글 목록 캐시에 새 답글 즉시 추가 (빠른 UI 반영)
        queryClient.setQueriesData(
          {
            queryKey: commentQueryKeys.replies(data.parentId)
          },
          (oldData: unknown) => {
            if (!oldData) {
              return oldData;
            }
            const cachedData = oldData as PaginationResult<Comment>
            return {
              ...cachedData,
              data: [...cachedData.data, newComment],
              pagination: {
                ...cachedData.pagination,
                total: cachedData.pagination.total + 1
              }
            }
          }
        )
      } else {
        // 일반 댓글인 경우: 댓글 목록의 맨 앞에 추가
        queryClient.setQueriesData(
          {
            queryKey: commentQueryKeys.lists(),
            predicate: (query) => {
              const [, , queryPostId] = query.queryKey
              return queryPostId === data.postId
            }
          },
          (oldData: unknown) => {
            if (!oldData) return oldData
            const cachedData = oldData as PaginationResult<Comment>
            return {
              ...cachedData,
              data: [newComment, ...cachedData.data],
              pagination: {
                ...cachedData.pagination,
                total: cachedData.pagination.total + 1
              }
            }
          }
        )

        // 게시글 상세 캐시에서 댓글 수 +1 업데이트
        if (data.postId) {
          queryClient.setQueryData(postQueryKeys.detail(data.postId), (old: unknown) => {
            if (!old) return old
            const oldPost = old as PostDetail
            return {
              ...oldPost,
              commentCount: oldPost.commentCount + 1
            }
          })
        }
      }
    },
  })
}

// 댓글 수정 Mutation Hook
export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ commentId, data }: { commentId: string; data: CommentForm }): Promise<Comment> => {
      return await updateComment(commentId, data)
    },
    onSuccess: (updatedComment) => {
      // 댓글 목록 캐시에서 해당 댓글 업데이트
      queryClient.setQueriesData(
        { 
          queryKey: commentQueryKeys.lists(),
          predicate: (query) => {
            const [, , queryPostId] = query.queryKey
            return queryPostId === updatedComment.postId
          }
        },
        (oldData: unknown) => {
          if (!oldData) return oldData
          const data = oldData as PaginationResult<Comment>
          return {
            ...data,
            data: data.data.map(comment => 
              comment.id === updatedComment.id ? updatedComment : comment
            )
          }
        }
      )
    },
  })
}

// 댓글 삭제 Mutation Hook
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, authorId }: { commentId: string; authorId: string }) =>
      deleteComment(commentId, authorId),
    onSuccess: (success, { commentId }) => {
      if (success) {
        let deletedCommentPostId: string | null = null;

        // 모든 댓글 목록 캐시에서 해당 댓글 제거
        queryClient.setQueriesData(
          { queryKey: commentQueryKeys.lists() },
          (oldData: unknown) => {
            if (!oldData) return oldData
            const data = oldData as PaginationResult<Comment>
            
            // 삭제할 댓글의 postId를 찾기
            const deletedComment = data.data.find(comment => comment.id === commentId);
            if (deletedComment) {
              deletedCommentPostId = deletedComment.postId;
            }
            
            return {
              ...data,
              data: data.data.filter(comment => comment.id !== commentId),
              pagination: {
                ...data.pagination,
                total: Math.max(0, data.pagination.total - 1)
              }
            }
          }
        )

        // 게시글 상세 캐시에서 댓글 수 -1 업데이트
        if (deletedCommentPostId) {
          queryClient.setQueryData(postQueryKeys.detail(deletedCommentPostId), (old: unknown) => {
            if (!old) return old
            const oldPost = old as PostDetail
            return {
              ...oldPost,
              commentCount: Math.max(0, oldPost.commentCount - 1)
            }
          })

        }
      }
    },
  })
}

// 댓글 좋아요 토글 Mutation Hook
export const useToggleCommentLikeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, memberId }: { commentId: string; memberId: string }) =>
      toggleCommentLike(commentId, memberId),
    onSuccess: (result: CommentLikeInfo, { commentId }) => {
      // 댓글 목록 캐시에서 해당 댓글의 좋아요 상태 업데이트
      queryClient.setQueriesData(
        { queryKey: commentQueryKeys.lists() },
        (oldData: unknown) => {
          if (!oldData) return oldData
          const data = oldData as PaginationResult<Comment>
          return {
            ...data,
            data: data.data.map(comment =>
              comment.id === commentId
                ? { ...comment, likeCount: result.likeCount, isLiked: result.isLiked }
                : comment
            )
          }
        }
      )
    },
  })
}

// 답글 목록 조회 Hook
export const useRepliesQuery = (parentCommentId: string, options: {
  page?: number;
  limit?: number;
  currentUserId?: string;
} = {}, queryOptions?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: commentQueryKeys.replies(parentCommentId),
    queryFn: async (): Promise<PaginationResult<Comment>> => {
      return await getReplies(parentCommentId, options)
    },
    enabled: queryOptions?.enabled !== undefined ? queryOptions.enabled : !!parentCommentId,
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 3 * 60 * 1000, // 3분
  })
}