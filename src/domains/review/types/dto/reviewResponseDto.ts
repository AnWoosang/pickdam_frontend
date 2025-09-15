
// 리뷰 이미지 응답 DTO
export interface ReviewImageResponseDto {
  url: string;
  order: number;
}

// 개별 리뷰 응답 DTO
export interface ReviewResponseDto {
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

