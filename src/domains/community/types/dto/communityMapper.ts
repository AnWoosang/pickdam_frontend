import { getCategoryName, Post, PostDetail, Comment, CommentLikeInfo, PostLikeInfo, PostViewInfo } from '@/domains/community/types/community';
import {
  PostResponseDto,
  CommentResponseDto,
  ToggleCommentLikeResponseDto,
  ToggleLikeResponseDto,
  PostIncrementViewResponseDto
} from '@/domains/community/types/dto/communityDto';

// =============================================
// POST MAPPERS
// =============================================

// PostDto를 Post 도메인 타입으로 변환
export function toPost(dto: PostResponseDto): Post {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content,
    authorNickname: dto.author.nickname,
    authorId: dto.authorId,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    viewCount: dto.viewCount,
    likeCount: dto.likeCount,
    commentCount: dto.commentCount,
    category: {
      id: dto.category,
      name: getCategoryName(dto.category)
    },
    isLiked: dto.isLiked ?? false,
    profileImageUrl: dto.author.profileImageUrl
  };
}

// PostDto를 PostDetail 도메인 타입으로 변환
export function toPostDetail(dto: PostResponseDto): PostDetail {
  return {
    ...toPost(dto),
    comments: [] // 댓글은 별도 API로 로드됨
  };
}

// =============================================
// COMMENT MAPPERS
// =============================================

export function toComment(dto: CommentResponseDto): Comment {
  return {
    id: dto.id,
    postId: dto.postId,
    parentId: dto.parentCommentId,
    content: dto.content,
    author: {
      nickname: dto.author.nickname,
      profileImageUrl: dto.author.profileImageUrl
    },
    authorId: dto.authorId,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    likeCount: dto.likeCount,
    isLiked: dto.isLiked ?? false,
    replyCount: dto.replyCount && dto.replyCount > 0 ? dto.replyCount : undefined
  };
}

// =============================================
// COMMENT LIKE MAPPERS
// =============================================

export function toCommentLikeInfo(dto: ToggleCommentLikeResponseDto): CommentLikeInfo {
  return {
    commentId: dto.commentId,
    isLiked: dto.isLiked,
    likeCount: dto.likeCount
  };
}

// =============================================
// POST LIKE MAPPERS
// =============================================

export function toPostLikeInfo(dto: ToggleLikeResponseDto, postId: string): PostLikeInfo {
  return {
    postId: postId,
    isLiked: dto.isLiked,
    likeCount: dto.newLikeCount
  };
}

// =============================================
// POST VIEW MAPPERS
// =============================================

export function toPostViewInfo(dto: PostIncrementViewResponseDto): PostViewInfo {
  return {
    postId: dto.postId,
    viewCount: dto.viewCount
  };
}