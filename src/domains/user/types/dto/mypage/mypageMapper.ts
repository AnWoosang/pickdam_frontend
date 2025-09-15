import { 
  UserStats,
  MyComment,
  MyPost
} from '@/domains/user/types/mypage/mypage';
import {
  MypageStatsResponseDto,
  MyPostResponseDto,
  MyCommentResponseDto,
  MyReviewResponseDto
} from './mypageDto';
import { Review } from '@/domains/review/types/review';

// UserStatsResponseDto를 UserStats 도메인 타입으로 변환
export function toUserStats(dto: MypageStatsResponseDto): UserStats {
  return {
    userId: dto.user_id,
    postCount: dto.total_posts,
    commentCount: dto.total_comments,
    likedPostsCount: dto.total_likes_received,
    likedCommentsCount: 0, // DTO에 없는 경우 기본값
    reviewCount: dto.total_reviews,
    wishlistCount: dto.wishlist_count,
    createdAt: new Date(dto.created_at),
  };
}

// MyPostResponseDto를 MyPost 도메인 타입으로 변환
export function toMyPost(dto: MyPostResponseDto): MyPost {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content,
    authorNickname: dto.authorNickname,
    authorId: dto.authorId,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    likeCount: dto.likeCount,
    commentCount: dto.commentCount,
    isLiked: dto.isLiked,
    categoryId: dto.categoryId,
    categoryName: dto.categoryName,
    profileImageUrl: dto.profileImageUrl
  };
}

// MyCommentResponseDto를 MyComment 도메인 타입으로 변환
export function toMyComment(dto: MyCommentResponseDto): MyComment {
  return {
    id: dto.id,
    postId: dto.postId,
    postTitle: dto.postTitle,
    content: dto.content,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    likeCount: dto.likeCount,
    parentCommentId: dto.parentCommentId,
    author: dto.author,
    isDeleted: dto.isDeleted,
    isLiked: dto.isLiked,
    profileImageUrl: dto.profileImageUrl
  };
}

// MyReviewItemResponseDto를 Review 도메인 타입으로 변환
export function toMyReview(dto: MyReviewResponseDto): Review {
  return {
    id: dto.id,
    userId: dto.userId,
    userName: dto.userName,
    profileImage: dto.profileImage,
    rating: dto.rating,
    sweetness: dto.sweetness || 0,
    menthol: dto.menthol || 0,
    throatHit: dto.throatHit || 0,
    body: dto.body || 0,
    freshness: dto.freshness || 0,
    content: dto.content,
    createdAt: dto.createdAt,
    images: dto.imageUrls?.map((url, index) => ({ url, order: index })) || []
  };
}

