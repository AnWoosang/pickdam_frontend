// 리뷰 API 요청 DTO 타입 정의
import { ImageUploadRequestDto } from '@/domains/image/types/dto/imageDto';

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

// 리뷰 수정 요청 DTO
export interface UpdateReviewRequestDto {
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