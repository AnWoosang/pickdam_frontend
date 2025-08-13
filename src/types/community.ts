// 커뮤니티 게시글 타입
export interface Post {
  id: string;
  title: string;
  content?: string;
  author: string;
  authorId?: string;
  createdAt: string; // ISO string
  updatedAt?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  category?: PostCategory;
  tags?: string[];
  isPopular?: boolean;
  isPinned?: boolean;
}

// 게시글 카테고리
export interface PostCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

// 댓글 타입
export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorId?: string;
  createdAt: string;
  updatedAt?: string;
  likeCount?: number;
  parentCommentId?: string; // 대댓글용
  replies?: Comment[];
}

// 게시글 목록 응답 타입
export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// 게시글 검색/필터 파라미터
export interface PostSearchParams {
  query?: string;
  category?: string;
  author?: string;
  sortBy?: 'latest' | 'popular' | 'oldest' | 'most_liked' | 'most_viewed';
  page?: number;
  limit?: number;
  tags?: string[];
}

// 게시글 작성/수정 데이터
export interface CreatePostData {
  title: string;
  content: string;
  categoryId?: string;
  tags?: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}