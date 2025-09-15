import { Comment } from '../../community';
import { 
  CommentResponseDto
} from './commentResponseDto';
import { PaginationResult } from '@/shared/types/pagination';

// CommentDto를 Comment 도메인 타입으로 변환 (통합 쿼리 결과)
export function toComment(dto: CommentResponseDto): Comment {
  return {
    id: dto.id,
    postId: dto.post_id,
    parentId: dto.parent_comment_id,
    replyToCommentId: dto.reply_to_comment_id,
    replyToUserId: dto.reply_to_user_id,
    replyToUsername: dto.reply_to_username,
    content: dto.content,
    // 새로운 author 구조 사용
    author: { 
      nickname: dto.author.nickname, 
      profile_image_url: dto.author.profile_image_url 
    },
    authorId: dto.author_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    likeCount: dto.like_count,
    isDeleted: dto.is_deleted,
    // 통합 쿼리에서 오는 새 필드들
    isLiked: dto.isLiked ?? false,
    replyCount: dto.replyCount && dto.replyCount > 0 ? dto.replyCount : undefined
  };
}

// PaginationResult<CommentResponseDto>를 Comment 배열로 변환 (페이지네이션 정보 포함)
export function toCommentsPage(response: PaginationResult<CommentResponseDto>): PaginationResult<Comment> {
  return {
    data: response.data.map(toComment),
    pagination: {
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.limit,
      totalPages: response.pagination.totalPages,
      hasNextPage: response.pagination.hasNextPage,
      hasPreviousPage: response.pagination.hasPreviousPage
    }
  };
}