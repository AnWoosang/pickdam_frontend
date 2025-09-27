import { apiClient } from '@/shared/api/axiosClient'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { PaginatedResponse, ApiResponse } from '@/shared/api/types';
import { PaginationResult } from '@/shared/types/pagination';
import { Post, PostDetail, PostForm, PostViewInfo, PostLikeInfo } from '@/domains/community/types/community';
import {
  PostsRequestParamDto,
  WritePostRequestDto,
  UpdatePostRequestDto,
  PostResponseDto,
  PostIncrementViewResponseDto,
  ToggleLikeResponseDto
} from '@/domains/community/types/dto/communityDto';
import { toPost, toPostDetail, toPostViewInfo, toPostLikeInfo } from '@/domains/community/types/dto/communityMapper'

// Post API 클라이언트
export const postApi = {
  // 게시글 목록 조회
  async getPosts(params: PostsRequestParamDto = {}): Promise<PaginationResult<Post>> {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })

    const query = queryParams.toString()
    const response = await apiClient.get<PaginatedResponse<PostResponseDto>>(`${API_ROUTES.COMMUNITY.POSTS}${query ? `?${query}` : ''}`)
    
    return {
      data: response.data ? response.data.map(toPost) : [],
      pagination: {
        total: response.pagination.total,
        page: response.pagination.page,
        limit: response.pagination.limit,
        totalPages: response.pagination.totalPages,
        hasNextPage: response.pagination.hasNextPage ?? false,
        hasPreviousPage: response.pagination.hasPreviousPage ?? false
      }
    }
  },

  // 게시글 상세 조회
  async getPost(id: string): Promise<PostDetail> {
    const response = await apiClient.get<ApiResponse<{ post: PostResponseDto }>>(API_ROUTES.COMMUNITY.POST_DETAIL(id))
    return toPostDetail(response.data!.post)
  },

  // 게시글 생성
  async createPost(postForm: PostForm): Promise<Post> {
    // PostForm을 WritePostRequestDto로 변환
    const requestDto: WritePostRequestDto = {
      title: postForm.title,
      content: postForm.content,
      categoryId: postForm.categoryId,
      authorId: postForm.authorId
    };

    const response = await apiClient.post<ApiResponse<{ post: PostResponseDto }>>(API_ROUTES.COMMUNITY.POSTS, requestDto)

    return toPost(response.data!.post)
  },

  // 게시글 수정
  async updatePost(id: string, postForm: PostForm): Promise<Post> {
    // PostForm을 UpdatePostRequestDto로 변환
    const requestDto: UpdatePostRequestDto = {
      title: postForm.title,
      content: postForm.content,
      categoryId: postForm.categoryId
    };

    const response = await apiClient.put<ApiResponse<{ post: PostResponseDto }>>(API_ROUTES.COMMUNITY.POST_DETAIL(id), requestDto)

    return toPost(response.data!.post)
  },

  // 게시글 삭제
  async deletePost(id: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(API_ROUTES.COMMUNITY.POST_DETAIL(id))

    return response.success
  },

  // 게시글 조회수 증가 (간소화)
  async incrementPostView(id: string): Promise<PostViewInfo> {
    const response = await apiClient.post<ApiResponse<PostIncrementViewResponseDto>>(API_ROUTES.COMMUNITY.POST_VIEW(id), {})
    return toPostViewInfo(response.data!)
  },

  // 게시글 좋아요 토글
  async togglePostLike(id: string): Promise<PostLikeInfo> {
    const response = await apiClient.post<ApiResponse<ToggleLikeResponseDto>>(API_ROUTES.COMMUNITY.POST_LIKE(id), {})
    return toPostLikeInfo(response.data!, id)
  },

  // 게시글 좋아요 상태 확인
  async checkPostLike(id: string): Promise<boolean> {
    const response = await apiClient.get<ApiResponse<{ liked: boolean }>>(API_ROUTES.COMMUNITY.POST_LIKE(id))
    return response.data!.liked
  }
}

