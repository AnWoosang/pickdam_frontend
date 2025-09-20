import { apiClient } from '@/shared/api/axiosClient';
import { API_ROUTES } from '@/app/router/apiRoutes';
import type { ApiResponse } from '@/shared/api/types';
import type { ImageUploadResponseDto } from '../types/dto/imageDto';
import { toImage } from '../types/dto/imageMapper';
import type { Image, ImageUpload } from '../types/Image';


export const imageApi = {
  uploadMultiple: async (imageUpload: ImageUpload): Promise<Image[]> => {
    const formData = new FormData();

    imageUpload.files.forEach(file => formData.append('files', file));
    formData.append('type', imageUpload.contentType);

    const apiResponse = await apiClient.post<ApiResponse<ImageUploadResponseDto[]>>(
      API_ROUTES.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const results = apiResponse.data || [];

    // 업로드 결과를 Image 타입으로 변환
    return results
      .filter((result) => result.success) // 성공한 업로드만 필터링
      .map((result) => {
        const originalFile = imageUpload.files[result.originalIndex];
        return toImage(result, originalFile, imageUpload.contentType);
      });
  },
}