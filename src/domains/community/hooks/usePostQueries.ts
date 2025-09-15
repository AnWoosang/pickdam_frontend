import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Post,
  PostDetail,
  CreatePostForm,
  UpdatePostForm
} from '@/domains/community/types/community';
import {
  CreatePostRequestDto,
  PostsRequestParamDto,
  UpdatePostRequestDto
} from '@/domains/community/types/dto/post/postRequestDto';
import { postApi } from '@/domains/community/api/postApi'
import { postQueryKeys } from '@/domains/community/constants/postQueryKeys'
import { PaginationResult } from '@/shared/types/pagination'

// 게시글 목록 조회 Hook (페이지네이션)
export const usePostsQuery = (params: PostsRequestParamDto = {}) => {
  return useQuery({
    queryKey: postQueryKeys.list(params),
    queryFn: async (): Promise<PaginationResult<Post>> => {
      return await postApi.getPosts(params)
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  })
}

// 게시글 상세 조회 Hook
export const usePostQuery = (id: string) => {
  return useQuery({
    queryKey: postQueryKeys.detail(id),
    queryFn: async (): Promise<PostDetail> => {
      return await postApi.getPost(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 3, // 3분
    gcTime: 1000 * 60 * 10, // 10분
  })
}

// 게시글 작성 Mutation Hook
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { form: CreatePostForm; imageUrls?: string[] }): Promise<Post> => {
      // Domain 타입을 DTO로 변환
      const requestDto: CreatePostRequestDto = {
        title: data.form.title,
        content: data.form.content,
        categoryId: data.form.categoryId,
        authorId: data.form.authorId
      };
      return await postApi.createPost(requestDto, data.imageUrls)
    },
    onSuccess: (post: Post) => {
      // 게시글 목록 캐시에 새 게시글 추가 (첫 번째에 삽입)
      queryClient.setQueriesData(
        { queryKey: postQueryKeys.lists() },
        (oldData: unknown) => {
          if (!oldData) return oldData
          const data = oldData as PaginationResult<Post>
          return {
            ...data,
            data: [post, ...data.data],
            pagination: {
              ...data.pagination,
              total: data.pagination.total + 1
            }
          }
        }
      )
      
      // 생성된 게시글을 상세 캐시에도 저장
      queryClient.setQueryData(postQueryKeys.detail(post.id), { 
        ...post, 
        comments: [] 
      })
    }
  })
}

// 게시글 수정 Mutation Hook
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, form }: { id: string; form: UpdatePostForm }): Promise<Post> => {
      // Domain 타입을 DTO로 변환
      const requestDto: UpdatePostRequestDto = {
        title: form.title,
        content: form.content,
        categoryId: form.categoryId,
        authorId: form.authorId
      };
      return await postApi.updatePost(id, requestDto)
    },
    onSuccess: (post: Post, { id }) => {
      // 특정 게시글 캐시 업데이트
      queryClient.setQueryData(postQueryKeys.detail(id), post)
      
      // 게시글 목록 캐시에서 해당 게시글 업데이트
      queryClient.setQueriesData(
        { queryKey: postQueryKeys.lists() },
        (oldData: unknown) => {
          if (!oldData) return oldData
          const data = oldData as PaginationResult<Post>
          return {
            ...data,
            data: data.data.map(existingPost => 
              existingPost.id === post.id ? post : existingPost
            )
          }
        }
      )
    }
  })
}

// 게시글 삭제 Mutation Hook
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, authorId }: { id: string; authorId: string }): Promise<boolean> => {
      return postApi.deletePost(id, authorId);
    },
    onSuccess: (success: boolean, { id }) => {
      if (success) {
        // 특정 게시글 캐시 제거
        queryClient.removeQueries({ queryKey: postQueryKeys.detail(id) })
        
        // 게시글 목록 캐시에서 해당 게시글 제거
        queryClient.setQueriesData(
          { queryKey: postQueryKeys.lists() },
          (oldData: unknown) => {
            if (!oldData) return oldData
            const data = oldData as PaginationResult<Post>
            return {
              ...data,
              data: data.data.filter(post => post.id !== id),
              pagination: {
                ...data.pagination,
                total: Math.max(0, data.pagination.total - 1)
              }
            }
          }
        )
      }
    }
  })
}

// 게시글 좋아요 토글 Mutation Hook
export const useTogglePostLikeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, memberId }: { id: string; memberId: string }) => 
      postApi.togglePostLike(id, memberId),
    onSuccess: (response, { id }) => {
      if (response.success) {
        // 게시글 상세 캐시에서 좋아요 상태 업데이트
        queryClient.setQueryData(postQueryKeys.detail(id), (old: unknown) => {
          if (!old) return old
          const oldPostDetail = old as PostDetail
          return {
            ...oldPostDetail,
            likeCount: response.newLikeCount,
            isLiked: response.isLiked
          }
        })
        
        // 게시글 목록 캐시에서 좋아요 상태 업데이트
        queryClient.setQueriesData(
          { queryKey: postQueryKeys.lists() },
          (oldData: unknown) => {
            if (!oldData) return oldData
            const data = oldData as PaginationResult<Post>
            return {
              ...data,
              data: data.data.map(post => 
                post.id === id ? {
                  ...post,
                  likeCount: response.newLikeCount,
                  isLiked: response.isLiked
                } : post
              )
            }
          }
        )
      }
    },
    // 에러는 던지기만 하고 처리는 비즈니스 레이어에서
  })
}

// 게시글 조회수 증가 Mutation Hook
export const useIncrementPostViewMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return postApi.incrementPostView(id);
    },
    onSuccess: (response, { id }) => {
      if (response.success) {
        // 서버 응답으로 조회수 업데이트
        queryClient.setQueryData(postQueryKeys.detail(id), (old: unknown) => {
          if (!old) return old
          
          const oldPostDetail = old as PostDetail;
          return {
            ...oldPostDetail,
            viewCount: response.newViewCount
          };
        })
      }
    }
    // 에러는 던지기만 하고 처리는 비즈니스 레이어에서
  })
}