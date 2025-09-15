// Comment API Request DTOs
export interface CreateCommentRequestDto {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
  replyToCommentId?: string;
  replyToUserId?: string;
  replyToUsername?: string;
}

export interface UpdateCommentRequestDto {
  content: string;
  authorId: string;
}

export interface DeleteCommentRequestDto {
  authorId: string;
}

export interface LikeCommentActionRequestDto {
  memberId: string;
}