// Mypage-specific Response DTOs
export interface MypageStatsResponseDto {
  userId: string;
  totalPosts: number;
  totalComments: number;
  totalReviews: number;
  createdAt: string;
}

export interface MyReviewResponseDto {
  id: string;
  userId: string;
  userName: string;
  profileImage?: string;
  rating: number;
  sweetness?: number;
  menthol?: number;
  throatHit?: number;
  body?: number;
  freshness?: number;
  content: string;
  createdAt: string;
  imageUrls?: string[];
  productId?: string;
  productName?: string;
}

export interface MyCommentResponseDto {
  id: string;
  postId: string;
  postTitle: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  parentCommentId: string | null;
  author: string; // nickname
  isLiked: boolean;
  profileImageUrl?: string;
}

// 내가 쓴 게시글 조회용 DTO
export interface MyPostResponseDto {
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

