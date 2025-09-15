import { apiClient } from '@/shared/api/axiosClient'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { PaginatedResponse } from '@/shared/api/types';
import { PaginationResult } from '@/shared/types/pagination';
import { Post, PostDetail } from '@/domains/community/types/community';
import {
  PostsRequestParamDto,
  DeletePostRequestDto,
  LikeActionRequestDto,
  CreatePostRequestDto,
  UpdatePostRequestDto
} from '@/domains/community/types/dto/post/postRequestDto';
import {
  PostResponseDto,
  IncrementViewResponseDto,
  ToggleLikeResponseDto
} from '@/domains/community/types/dto/post/postResponseDto';
import { toPost, toPostDetail } from '@/domains/community/types/dto/post/postMapper'

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
    const response = await apiClient.get<{ data: { post: PostResponseDto } }>(API_ROUTES.COMMUNITY.POST_DETAIL(id))
    return toPostDetail(response.data.post)
  },

  // 게시글 생성
  async createPost(requestDto: CreatePostRequestDto, imageUrls?: string[]): Promise<Post> {
    // 이미지 URL을 ImageUploadRequestDto 형태로 변환
    const images = imageUrls?.map((url, index) => ({
      image_url: url,
      image_order: index
    })) || [];
    
    const requestWithImages = {
      ...requestDto,
      images
    };
    
    const response = await apiClient.post<{ data: { post: PostResponseDto } }>(API_ROUTES.COMMUNITY.POSTS, requestWithImages)
    
    return toPost(response.data.post)
  },

  // 게시글 수정
  async updatePost(id: string, requestDto: UpdatePostRequestDto, imageUrls?: string[]): Promise<Post> {
    // 이미지 URL을 ImageUploadRequestDto 형태로 변환
    const images = imageUrls?.map((url, index) => ({
      image_url: url,
      image_order: index
    })) || [];
    
    const updateRequestWithImages = {
      ...requestDto,
      images
    }
    
    const response = await apiClient.put<{ data: { post: PostResponseDto } }>(API_ROUTES.COMMUNITY.POST_DETAIL(id), updateRequestWithImages)
    
    // 백엔드에서 CASCADE + Trigger로 이미지 처리 완료됨
    // 별도의 이미지 API 호출 불필요
    
    return toPost(response.data.post)
  },

  // 게시글 삭제
  async deletePost(id: string, authorId: string): Promise<boolean> {
    const requestDto: DeletePostRequestDto = { authorId }
    const response = await apiClient.delete<{ success: boolean }>(API_ROUTES.COMMUNITY.POST_DETAIL(id), { data: requestDto })
    
    // CASCADE + Trigger가 자동으로 이미지 테이블과 스토리지 정리
    // 1. 게시글 soft delete → is_deleted = true
    // 2. CASCADE → post_image 테이블 레코드 삭제
    // 3. Trigger → Edge Function 호출 → 스토리지 파일 삭제
    
    return response.success
  },

  // 게시글 조회수 증가 (간소화)
  async incrementPostView(id: string) {
    const response = await apiClient.post<IncrementViewResponseDto>(API_ROUTES.COMMUNITY.POST_VIEW(id), {})
    return {
      success: response.success,
      incremented: true,
      newViewCount: response.newViewCount,
      reason: 'success'
    }
  },

  // 게시글 좋아요 토글
  async togglePostLike(id: string, memberId: string) {
    const requestDto: LikeActionRequestDto = { memberId }
    const response = await apiClient.post<ToggleLikeResponseDto>(API_ROUTES.COMMUNITY.POST_LIKE(id), requestDto)
    return {
      success: response.success,
      isLiked: response.isLiked,
      newLikeCount: response.newLikeCount
    }
  },

  // 게시글 좋아요 상태 확인
  async checkPostLike(id: string, memberId: string): Promise<boolean> {
    const response = await apiClient.get<{ data: { liked: boolean } }>(`${API_ROUTES.COMMUNITY.POST_LIKE(id)}?memberId=${memberId}`)
    return response.data.liked
  },

  // 간단한 조회수 증가 (ViewActionData 없이)
  async incrementPostViewSimple(id: string) {
    const response = await apiClient.post<IncrementViewResponseDto>(API_ROUTES.COMMUNITY.POST_VIEW(id), {})
    return {
      success: response.success,
      incremented: response.incremented,
      newViewCount: response.newViewCount
    }
  },
}

