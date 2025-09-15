// 마이페이지 관련 도메인 타입들

// 사용자 통계 도메인 타입
export interface UserStats {
  userId: string;
  postCount: number;
  commentCount: number;
  likedPostsCount: number;
  likedCommentsCount: number;
  reviewCount: number;
  wishlistCount: number;
  createdAt: Date;
}

// 마이페이지에서 사용하는 댓글 타입 (실제 필요한 필드만)
export interface MyComment {
  id: string;
  postId: string;
  postTitle: string; // 게시글 제목 (마이페이지에서만 필요)
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  parentCommentId: string | null;
  author: string; // nickname만
  isDeleted: boolean;
  isLiked: boolean;
  profileImageUrl?: string;
}

// 마이페이지에서 사용하는 게시글 타입 (실제 필요한 필드만)
export interface MyPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorNickname: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  categoryId?: string;
  categoryName?: string;
  profileImageUrl?: string;
}