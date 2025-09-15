import { useMutation } from '@tanstack/react-query'
import { imageApi } from '../api/imageApi'
import type { Image } from '../types/Image'
import type { ImageContentType } from '../types/Image'

// 이미지 업로드 입력 타입 (단일/다중 모두 지원)
interface ImageUploadInput {
  files: File[]  // 단일 파일도 배열로 처리
  type: ImageContentType
}

export const useImageUploadQuery = () => {
  return useMutation<Image[], Error, ImageUploadInput>({
    mutationFn: async ({ files, type }) => {
      return await imageApi.uploadMultiple(files, type);
    }
  })
}