// API 응답에서 받는 실제 DTO 타입 (백엔드에서 오는 형태)
export interface PostResponseDto {
  id: string;
  title: string;
  content?: string;
  author_id: string; // DB 필드명 (snake_case)
  category: string; // 실제 백엔드 응답에서 오는 필드
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  version?: number; // Optimistic Lock용 버전 필드
  thumbnail_image_url?: string;
  deleted_at?: string;
  author: {
    nickname: string;
    profile_image_url?: string;
  };
  images: Array<{
    id: string;
    image_url: string;
    image_name: string;
    sort_order: number;
  }>;
}

export interface IncrementViewResponseDto {
  success: boolean;
  incremented: boolean;
  newViewCount: number;
  reason?: string;
}

export interface ToggleLikeResponseDto {
  success: boolean;
  isLiked: boolean;
  newLikeCount: number;
  newVersion?: number; // Optimistic Lock용 새 버전
}