// 이미지 컨텐츠 타입
export type ImageContentType = 'reviews' | 'profile' | 'posts' | 'products';

// 이미지 도메인 모델 (서버에서 받는 데이터)
export interface Image {
  id: string;
  url: string;
  fileName: string;
  contentType: ImageContentType;
  createdAt: Date;
}

// 이미지 업로드 요청 객체
export interface ImageUpload {
  files: File[];
  contentType: ImageContentType;
}

// 이미지 상태 타입
export type ImageStatus = 'local' | 'uploaded' | 'deleted';

// 이미지 상태 상수
export const IMAGE_STATUS = {
  LOCAL: 'local' as const,
  UPLOADED: 'uploaded' as const,
  DELETED: 'deleted' as const,
} satisfies Record<string, ImageStatus>;

// 통합된 이미지 상태 (로컬 + 서버 이미지 모두 처리)
export interface ImageState {
  id: string;
  previewUrl: string; // blob URL (새 이미지) 또는 서버 URL (기존 이미지)
  status: ImageStatus;
  file?: File; // 새 이미지인 경우
  uploadedImage?: Image; // 업로드 완료된 경우
}

// 이미지 설정 통합 (제한 + 압축 설정)
export interface ImageConfig {
  maxFiles: number;
  maxSizeMB: number;
  compressOptions: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    maxSizeKB: number;
  };
}

export const IMAGE_CONFIG: Record<ImageContentType, ImageConfig> = {
  reviews: {
    maxFiles: 5,
    maxSizeMB: 10,
    compressOptions: { maxWidth: 800, maxHeight: 800, quality: 0.85, maxSizeKB: 300 }
  },
  profile: {
    maxFiles: 1,
    maxSizeMB: 5,
    compressOptions: { maxWidth: 400, maxHeight: 400, quality: 0.9, maxSizeKB: 200 }
  },
  posts: {
    maxFiles: 10,
    maxSizeMB: 10,
    compressOptions: { maxWidth: 1200, maxHeight: 1200, quality: 0.8, maxSizeKB: 500 }
  },
  products: {
    maxFiles: 5,
    maxSizeMB: 5,
    compressOptions: { maxWidth: 1200, maxHeight: 1200, quality: 0.9, maxSizeKB: 800 }
  }
};

