import {
  UserStats,
  MyComment,
  MyPost
} from '@/domains/user/types/mypage';
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
    userId: dto.userId,
    postCount: dto.totalPosts,
    commentCount: dto.totalComments,
    reviewCount: dto.totalReviews,
    createdAt: new Date(dto.createdAt),
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
    images: dto.imageUrls?.map((url, index) => ({ image_url: url, image_order: index + 1 })) || [],
    productId: dto.productId || ''
  };
}

