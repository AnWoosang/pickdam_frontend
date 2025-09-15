// PaginatedResponse<CommentResponseDto> 직접 사용

// Comment API Response DTOs  
// API 응답에서 받는 실제 DTO 타입 (백엔드에서 오는 형태)
export interface CommentResponseDto {
  id: string;
  post_id: string;
  parent_comment_id?: string;
  reply_to_comment_id?: string;
  reply_to_user_id?: string;
  reply_to_username?: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  is_deleted: boolean;
  deleted_at?: string;
  
  // 서버에서 JOIN으로 가져오는 필드들
  author: {
    nickname: string;
    profile_image_url?: string;
  };
  
  // 통합 쿼리에서 추가되는 필드들
  isLiked?: boolean;  // 현재 사용자의 좋아요 상태
  replyCount?: number;  // 답글 개수
}

// Comment API Response Wrappers - 제거됨, PaginatedResponse<CommentResponseDto> 직접 사용

// 댓글 생성/수정/삭제는 CommentResponseDto 또는 success boolean을 직접 사용

export interface ToggleCommentLikeResponseDto {
  success: boolean;
  isLiked: boolean;
  newLikeCount: number;
}