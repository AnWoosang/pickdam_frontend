import { PostSort, SortOrder } from '@/domains/community/types/community';

// =============================================
// POST DTOs
// =============================================

// Post API Request DTOs
export interface PostsRequestParamDto {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: PostSort;
  sortOrder?: SortOrder;
}

export interface WritePostRequestDto {
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
}

// Post API Response DTOs
export interface PostResponseDto {
  id: string;
  title: string;
  content?: string;
  authorId: string;
  category: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean; // 현재 사용자의 좋아요 상태
  author: {
    nickname: string;
    profileImageUrl?: string;
  };
}

export interface PostIncrementViewResponseDto {
  postId: string;
  viewCount: number;
}

export interface ToggleLikeResponseDto {
  isLiked: boolean;
  newLikeCount: number;
}

// =============================================
// COMMENT DTOs
// =============================================

export interface CommentWriteRequestDto {
  content: string;
  postId?: string;
  authorId: string;
  parentId?: string;
}

export interface CommentResponseDto {
  id: string;
  postId: string;
  parentCommentId?: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;

  author: {
    nickname: string;
    profileImageUrl?: string;
  };

  isLiked: boolean;
  replyCount: number;
}

export interface ToggleCommentLikeResponseDto {
  isLiked: boolean;
  likeCount: number;
  commentId: string;
}