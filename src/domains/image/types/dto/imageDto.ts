// 단일 이미지 업로드 응답 DTO
export interface ImageUploadResponseDto {
  url: string;
  path: string;
  fileName: string;
}

// 다중 이미지 업로드 응답의 개별 결과 DTO
export interface ImageUploadResultDto {
  success: boolean;
  originalIndex: number;
  originalFileName: string;
  originalFileSize: number;
  originalFileType: string;
  url?: string;
  path?: string;
  fileName?: string;
  error?: string;
}

// 다중 이미지 업로드 응답 DTO
export interface MultiImageUploadResponseDto {
  results: ImageUploadResultDto[];
  successCount: number;
  failedCount: number;
}

// 이미지 업로드 요청 DTO (공통)
export interface ImageUploadRequestDto {
  image_url: string;
  image_order: number;
}

