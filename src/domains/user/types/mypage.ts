export interface UserStats {
  userId: string;
  postCount: number;
  commentCount: number;
  reviewCount: number;
  createdAt: Date;
}

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
  isLiked: boolean;
  profileImageUrl?: string;
}

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