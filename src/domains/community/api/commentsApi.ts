import { apiClient } from '@/shared/api/axiosClient'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { PaginatedResponse, ApiResponse } from '@/shared/api/types';
import { PaginationResult } from '@/shared/types/pagination'
import { Comment, CommentForm, CommentLikeInfo } from '@/domains/community/types/community';
import {
  CommentWriteRequestDto,
  CommentResponseDto,
  ToggleCommentLikeResponseDto
} from '@/domains/community/types/dto/communityDto';
import { toComment, toCommentLikeInfo } from '@/domains/community/types/dto/communityMapper'

// 댓글 목록 조회 (통합 버전 - 좋아요 상태, 답글 수 포함)
export const getComments = async (postId: string, options: {
  page?: number;
  limit?: number;
  currentUserId?: string;
} = {}): Promise<PaginationResult<Comment>> => {
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
};

// 댓글 작성 (댓글과 답글을 구분해서 처리)
export const createComment = async (commentForm: CommentForm): Promise<Comment> => {
  const requestDto: CommentWriteRequestDto = {
    content: commentForm.content,
    postId: commentForm.postId,
    authorId: commentForm.authorId,
    parentId: commentForm.parentId
  };

  // 답글인 경우 답글 생성 엔드포인트 사용
  if (commentForm.parentId) {
    const response = await apiClient.post<ApiResponse<{ comment: CommentResponseDto }>>(
      API_ROUTES.COMMUNITY.COMMENT_DETAIL(commentForm.parentId),
      requestDto
    );
    return toComment(response.data!.comment);
  }

  // 일반 댓글인 경우 기존 엔드포인트 사용
  const response = await apiClient.post<ApiResponse<{ comment: CommentResponseDto }>>(
    API_ROUTES.COMMUNITY.COMMENTS,
    requestDto
  );

  return toComment(response.data!.comment);
};

// 댓글 수정
export const updateComment = async (commentId: string, commentForm: CommentForm): Promise<Comment> => {
  const requestDto: CommentWriteRequestDto = {
    content: commentForm.content,
    postId: commentForm.postId,
    authorId: commentForm.authorId,
    parentId: commentForm.parentId
  };

  const response = await apiClient.put<ApiResponse<{ comment: CommentResponseDto }>>(
    API_ROUTES.COMMUNITY.COMMENT_DETAIL(commentId),
    requestDto
  );

  return toComment(response.data!.comment);
};

// 댓글 삭제
export const deleteComment = async (commentId: string, authorId: string): Promise<boolean> => {
  const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
    API_ROUTES.COMMUNITY.COMMENT_DETAIL(commentId),
    { data: { authorId } }
  );
  return response.success || true;
};

// 댓글 좋아요 토글
export const toggleCommentLike = async (commentId: string, memberId: string): Promise<CommentLikeInfo> => {
  const response = await apiClient.post<ApiResponse<ToggleCommentLikeResponseDto>>(
    API_ROUTES.COMMUNITY.COMMENT_LIKE(commentId),
    { memberId: memberId }
  );

  return toCommentLikeInfo(response.data!);
};

// 답글 조회 (지연 로딩용)
export const getReplies = async (parentCommentId: string, options: {
  page?: number;
  limit?: number;
  currentUserId?: string;
} = {}): Promise<PaginationResult<Comment>> => {
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
};

