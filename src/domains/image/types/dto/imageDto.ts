// 단일 이미지 업로드 응답 DTO
export interface ImageUploadResponseDto {
  success: boolean;
  originalIndex: number;
  originalFileName: string;
  originalFileSize: number;
  originalFileType: string;
  path: string;
  url: string;
  fileName: string;
}

// 이미지 업로드 요청 DTO (공통)
export interface ImageUploadRequestDto {
  imageUrl: string;
  imageOrder: number;
}

