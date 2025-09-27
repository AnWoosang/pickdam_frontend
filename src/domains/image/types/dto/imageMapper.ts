import type { Image } from '../Image';
import type { 
  ImageUploadResponseDto
} from './imageDto';
import type { ImageContentType } from '../Image';


// 업로드 응답 DTO를 도메인 모델로 변환
export function toImage(
  dto: ImageUploadResponseDto,
  file: File,
  contentType: ImageContentType
): Image {
  return {
    id: crypto.randomUUID(),
    url: dto.url,
    fileName: dto.fileName,
    contentType,
    createdAt: new Date(),
  };
}

