import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, PostDetail } from '@/domains/community/types/community';
import { commentQueryKeys } from '@/domains/community/constants/commentQueryKeys';
import { postQueryKeys } from '@/domains/community/constants/postQueryKeys';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike
} from '@/domains/community/api/commentsApi';
import {
  CreateCommentRequestDto,
  UpdateCommentRequestDto
} from '@/domains/community/types/dto/comment/commentRequestDto';
import { PaginationResult } from '@/shared/types/pagination';

// 댓글 목록 조회 Hook (통합 버전 - 좋아요 상태 포함)
export const useCommentsQuery = (postId: string, options: {
  page?: number;
  limit?: number;
  currentUserId?: string;
} = {}) => {
  return useQuery({
    queryKey: commentQueryKeys.list(postId, options),
    queryFn: async (): Promise<PaginationResult<Comment>> => {
      return await getComments(postId, options)
    },
    enabled: !!postId,
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 3 * 60 * 1000, // 3분
  })
}

// 댓글 작성 Mutation Hook
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCommentRequestDto): Promise<Comment> => {
      return await createComment(data)
    },
    onSuccess: (newComment, data) => {
      // 1. 댓글 목록 캐시에 새 댓글 추가 (첫 번째에 삽입)
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
          const data = oldData as PaginationResult<Comment>
          return {
            ...data,
            data: [newComment, ...data.data],
            pagination: {
              ...data.pagination,
              total: data.pagination.total + 1
            }
          }
        }
      )

      // 2. 게시글 상세 캐시에서 댓글 수 +1 업데이트
      queryClient.setQueryData(postQueryKeys.detail(data.postId), (old: unknown) => {
        if (!old) return old
        const oldPost = old as PostDetail
        return {
          ...oldPost,
          commentCount: oldPost.commentCount + 1
        }
      })
    },
  })
}

// 댓글 수정 Mutation Hook
export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ commentId, data }: { commentId: string; data: UpdateCommentRequestDto }): Promise<Comment> => {
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
    onSuccess: (result, { commentId }) => {
      if (result.success) {
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
                  ? { ...comment, likeCount: result.newLikeCount, isLiked: result.isLiked }
                  : comment
              )
            }
          }
        )
      }
    },
  })
}