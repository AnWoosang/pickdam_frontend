// 리뷰 API DTO 타입 정의
import { ImageUploadRequestDto } from '@/domains/image/types/dto/imageDto';

// =============================================
// REQUEST DTOs
// =============================================

// 리뷰 생성 요청 DTO
export interface CreateReviewRequestDto {
  productId: string;
  memberId: string;
  rating: number;
  content: string;
  sweetness?: number;
  menthol?: number;
  throatHit?: number;
  body?: number;
  freshness?: number;
  images?: ImageUploadRequestDto[];
}

// =============================================
// RESPONSE DTOs
// =============================================

// 리뷰 이미지 응답 DTO
export interface ReviewImageResponseDto {
  imageUrl: string;
  imageOrder: number;
}

// 개별 리뷰 응답 DTO
export interface ReviewResponseDto {
  id: string;
  productId: string;
  memberId: string;
  nickname: string;
  profileImageUrl?: string;
  rating: number;
  sweetness?: number;
  menthol?: number;
  throatHit?: number;
  body?: number;
  freshness?: number;
  content: string;
  createdAt: string;
  images?: ReviewImageResponseDto[];
}

// 평균 리뷰 정보 응답 DTO
export interface AverageReviewInfoResponseDto {
  totalReviews: number;
  averageRating: number;
  averageSweetness?: number;
  averageMenthol?: number;
  averageThroatHit?: number;
  averageBody?: number;
  averageFreshness?: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}