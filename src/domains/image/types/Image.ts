// 이미지 컨텐츠 타입
export type ImageContentType = 'review' | 'profile' | 'post' | 'product';

// 이미지 도메인 모델
export interface Image {
  id: string
  url: string
  fileName: string
  filePath: string
  contentType: ImageContentType
  fileSize?: number
  mimeType?: string
  createdAt: Date
  updatedAt?: Date
  isPreview: boolean
  userId?: string // 사용자 ID (선택적 필드)
}

// 이미지 업로드 도메인 객체
export interface ImageUpload {
  files: File[]
  contentType: ImageContentType
}

// 이미지 업로드 상태 (UI용)
export interface ImageUploadState {
  id: string
  file: File
  previewUrl: string  // 로컬 미리보기 URL (blob:)
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  result?: Image  // 업로드 완료된 서버 이미지
}

// 통합된 이미지 상태 (기존 + 새 이미지)
export interface UnifiedImageState {
  id: string
  previewUrl: string // Data URL 또는 서버 URL
  isExisting: boolean
  serverId?: string // 기존 이미지의 서버 ID
  file?: File // 새 이미지의 파일
  isDeleted: boolean
}

// 이미지 업로드 제한 설정
export const IMAGE_LIMITS: Record<ImageContentType, number> = {
  review: 5,
  profile: 1,
  post: 10,
  product: 10,
}