// 리뷰 관련 타입 정의

// 리뷰 타입
export interface Review {
  id: string;
  productId: string;
  memberId: string;
  nickname: string;
  rating: number;
  sweetness: number;
  menthol: number;
  throatHit: number;
  body: number;
  freshness: number;
  content: string;
  createdAt: Date;
  images: ReviewImage[];
  profileImageUrl?: string;
}

// 리뷰 평가 정보
export interface ReviewRating {
  rating: number; // 전체 평점 (1-5)
  sweetness: number; // 달콤함 (1-5)
  menthol: number; // 멘솔감 (1-5)
  throatHit: number; // 목넘김 (1-5)
  body: number; // 바디감 (1-5)
  freshness: number; // 신선함 (1-5)
}

// 평균 리뷰 정보
export interface AverageReviewInfo extends ReviewRating {
  totalReviewCount: number;
  ratingDistribution: { stars: number; count: number }[];
}

// 리뷰 이미지 타입
export interface ReviewImage {
  imageUrl: string;
  imageOrder: number;
}

// 리뷰 폼 데이터 (컴포넌트에서 사용)
export interface ReviewForm {
  rating: number;
  content: string;
  sweetness: number;
  menthol: number;
  throatHit: number;
  body: number;
  freshness: number;
  uploadedImageUrls: string[];
}