import { Review, ReviewImage } from '../review';
import { ReviewResponseDto, ReviewImageResponseDto } from './reviewResponseDto';

function toReviewImage(dto: ReviewImageResponseDto): ReviewImage {
  return {
    url: dto.url,
    order: dto.order
  };
}

export function toReview(dto: ReviewResponseDto): Review {
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
    images: dto.images?.map(toReviewImage) || [],
  };
}