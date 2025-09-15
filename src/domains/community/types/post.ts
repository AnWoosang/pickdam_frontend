// Post 타입 정의
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorNickname: string;
  categoryId: string;
  categoryName: string;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostSummary {
  id: string;
  title: string;
  authorNickname: string;
  categoryName: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  thumbnailUrl?: string;
}

export interface PostComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorNickname: string;
  parentCommentId?: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: PostComment[];
}

export interface PostListParams {
  page?: number;
  size?: number;
  categoryId?: string;
  sortBy?: 'latest' | 'popular' | 'oldest';
  search?: string;
}

export interface PostCreateRequest {
  title: string;
  content: string;
  categoryId: string;
  imageUrls?: string[];
}

export interface PostUpdateRequest {
  title?: string;
  content?: string;
  categoryId?: string;
  imageUrls?: string[];
}