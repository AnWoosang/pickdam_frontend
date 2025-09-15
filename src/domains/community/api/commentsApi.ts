import { apiClient } from '@/shared/api/axiosClient'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { PaginatedResponse } from '@/shared/api/types';
import { PaginationResult } from '@/shared/types/pagination'
import { Comment } from '@/domains/community/types/community';
import {
  CreateCommentRequestDto,
  UpdateCommentRequestDto,
  DeleteCommentRequestDto
} from '@/domains/community/types/dto/comment/commentRequestDto';
import { CommentResponseDto } from '@/domains/community/types/dto/comment/commentResponseDto';
import { toComment } from '@/domains/community/types/dto/comment/commentMapper'

// 댓글 목록 조회 (통합 버전 - 좋아요 상태, 답글 수 포함)
export const getComments = async (postId: string, options: {
  page?: number;
  limit?: number;
  currentUserId?: string;
} = {}): Promise<PaginationResult<Comment>> => {
  try {
    const { page = 1, limit = 20, currentUserId } = options;
    
    // currentUserId가 있으면 쿼리에 포함
    let url = `${API_ROUTES.COMMUNITY.COMMENTS}?postId=${postId}&page=${page}&limit=${limit}`
    if (currentUserId) {
      url += `&currentUserId=${currentUserId}`
    }
    const response = await apiClient.get<PaginatedResponse<CommentResponseDto>>(url);
    
    return {
      data: response.data ? response.data.map(toComment) : [],
      pagination: {
        total: response.pagination.total,
        page: response.pagination.page,
        limit: response.pagination.limit,
        totalPages: response.pagination.totalPages,
        hasNextPage: response.pagination.hasNextPage ?? false,
        hasPreviousPage: response.pagination.hasPreviousPage ?? false
      }
    };
  } catch (error) {
    throw error
  }
};

// 댓글 작성
export const createComment = async (requestDto: CreateCommentRequestDto): Promise<Comment> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      data: { comment: CommentResponseDto };
    }>(API_ROUTES.COMMUNITY.COMMENTS, requestDto);
    
    console.log('댓글 작성 API 응답:', response);
    return toComment(response.data.comment);
  } catch (error) {
    console.error('댓글 작성 API 오류:', error);
    throw error
  }
};

// 댓글 수정
export const updateComment = async (commentId: string, requestDto: UpdateCommentRequestDto): Promise<Comment> => {
  try {
    const response = await apiClient.put<{
      success: boolean;
      data: { comment: CommentResponseDto };
    }>(API_ROUTES.COMMUNITY.COMMENT_DETAIL(commentId), requestDto);
    
    console.log('댓글 수정 API 응답:', response);
    return toComment(response.data.comment);
  } catch (error) {
    console.error('댓글 수정 API 오류:', error);
    throw error
  }
};

// 댓글 삭제
export const deleteComment = async (commentId: string, authorId: string): Promise<boolean> => {
  try {
    const requestDto: DeleteCommentRequestDto = {
      authorId: authorId
    };

    const response = await apiClient.delete<{ success: boolean }>(API_ROUTES.COMMUNITY.COMMENT_DETAIL(commentId), { data: requestDto });
    return response.success || true;
  } catch (error) {
    throw error
  }
};

// 댓글 좋아요 토글
export const toggleCommentLike = async (commentId: string, memberId: string) => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      data: {
        success: boolean;
        isLiked: boolean;
        newLikeCount: number;
      }
    }>(API_ROUTES.COMMUNITY.COMMENT_LIKE(commentId), {
      memberId: memberId
    });

    return {
      success: response.data.success,
      isLiked: response.data.isLiked,
      newLikeCount: response.data.newLikeCount
    };
  } catch (error) {
    throw error
  }
};

// 답글 조회 (지연 로딩용)
export const getReplies = async (parentCommentId: string, options: {
  page?: number;
  limit?: number;
  currentUserId?: string;
} = {}): Promise<PaginationResult<Comment>> => {
  try {
    const { page = 1, limit = 20, currentUserId } = options;
    
    // currentUserId가 있으면 쿼리에 포함
    let url = `${API_ROUTES.COMMUNITY.COMMENT_REPLIES(parentCommentId)}?page=${page}&limit=${limit}`
    if (currentUserId) {
      url += `&currentUserId=${currentUserId}`
    }
    
    const response = await apiClient.get<PaginatedResponse<CommentResponseDto>>(url);
    
    return {
      data: response.data ? response.data.map(toComment) : [],
      pagination: {
        total: response.pagination.total,
        page: response.pagination.page,
        limit: response.pagination.limit,
        totalPages: response.pagination.totalPages,
        hasNextPage: response.pagination.hasNextPage ?? false,
        hasPreviousPage: response.pagination.hasPreviousPage ?? false
      }
    };
  } catch (error) {
    throw error
  }
};

