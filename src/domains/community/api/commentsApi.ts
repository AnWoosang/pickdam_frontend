import { apiClient } from '@/shared/api/axiosClient'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { PaginatedResponse, ApiResponse } from '@/shared/api/types';
import { PaginationResult } from '@/shared/types/pagination'
import { Comment, CommentForm, CommentLikeInfo } from '@/domains/community/types/community';
import {
  CommentWriteRequestDto,
  UpdateCommentRequestDto,
  CommentResponseDto,
  ToggleCommentLikeResponseDto
} from '@/domains/community/types/dto/communityDto';
import { toComment, toCommentLikeInfo } from '@/domains/community/types/dto/communityMapper'

// 댓글 목록 조회 (통합 버전 - 좋아요 상태, 답글 수 포함)
export const getComments = async (postId: string, options: {
  page?: number;
  limit?: number;
} = {}): Promise<PaginationResult<Comment>> => {
  const { page = 1, limit = 20 } = options;

  const url = `${API_ROUTES.COMMUNITY.COMMENTS}?postId=${postId}&page=${page}&limit=${limit}`
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
};

// 댓글 작성 (일반 댓글만)
export const createComment = async (commentForm: CommentForm): Promise<Comment> => {
  const requestDto: CommentWriteRequestDto = {
    content: commentForm.content,
    postId: commentForm.postId
  };

  const response = await apiClient.post<ApiResponse<{ comment: CommentResponseDto }>>(
    API_ROUTES.COMMUNITY.COMMENTS,
    requestDto
  );

  return toComment(response.data!.comment);
};

// 답글 작성 (답글만)
export const createReply = async (commentForm: CommentForm): Promise<Comment> => {
  const requestDto: CommentWriteRequestDto = {
    content: commentForm.content,
    postId: commentForm.postId,
    parentId: commentForm.parentId
  };

  const response = await apiClient.post<ApiResponse<{ comment: CommentResponseDto }>>(
    API_ROUTES.COMMUNITY.COMMENT_REPLIES(commentForm.parentId!),
    requestDto
  );

  return toComment(response.data!.comment);
};

// 댓글 수정
export const updateComment = async (commentId: string, commentForm: CommentForm): Promise<Comment> => {
  const requestDto: UpdateCommentRequestDto = {
    content: commentForm.content
  };

  const response = await apiClient.put<ApiResponse<{ comment: CommentResponseDto }>>(
    API_ROUTES.COMMUNITY.COMMENT_DETAIL(commentId),
    requestDto
  );

  return toComment(response.data!.comment);
};

// 댓글 삭제 (부모 댓글 + 모든 답글 삭제)
export const deleteComment = async (commentId: string): Promise<boolean> => {
  const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
    API_ROUTES.COMMUNITY.COMMENT_DETAIL(commentId)
  );
  return response.success || true;
};

// 답글 삭제 (답글 1개만 삭제)
export const deleteReply = async (parentCommentId: string, replyId: string): Promise<boolean> => {
  const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
    API_ROUTES.COMMUNITY.REPLY_DELETE(parentCommentId, replyId)
  );
  return response.success || true;
};

// 댓글 좋아요 토글
export const toggleCommentLike = async (commentId: string): Promise<CommentLikeInfo> => {
  const response = await apiClient.post<ApiResponse<ToggleCommentLikeResponseDto>>(
    API_ROUTES.COMMUNITY.COMMENT_LIKE(commentId),
    {}
  );

  return toCommentLikeInfo(response.data!);
};

// 답글 조회 (지연 로딩용)
export const getReplies = async (parentCommentId: string, options: {
  page?: number;
  limit?: number;
} = {}): Promise<PaginationResult<Comment>> => {
  const { page = 1, limit = 20 } = options;

  const url = `${API_ROUTES.COMMUNITY.COMMENT_REPLIES(parentCommentId)}?page=${page}&limit=${limit}`

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
};

