import { apiClient } from '@/shared/api/axiosClient';
import type { ApiResponse } from '@/shared/api/types';
import type { 
  ImageUploadResponseDto,
  ImageUploadResultDto
} from '../types/dto/imageDto';
import { toImage } from '../types/dto/imageMapper';
import type { Image } from '../types/Image';
import type { ImageContentType } from '../types/Image';


export const imageApi = {
  uploadMultiple: async (
    files: File[], 
    contentType: ImageContentType
  ): Promise<Image[]> => {
    const formData = new FormData();
    
    files.forEach(file => formData.append('files', file));
    formData.append('type', contentType);

    const apiResponse = await apiClient.post<ApiResponse<ImageUploadResultDto[]>>(
      '/upload-image', 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const results = apiResponse.data || [];
    return results
      .filter((result: ImageUploadResultDto) => result.success)
      .map((result: ImageUploadResultDto) => {
        const responseDto: ImageUploadResponseDto = {
          url: result.url!,
          path: result.path!,
          fileName: result.fileName!
        };
        
        const originalFile = files[result.originalIndex];
        return toImage(responseDto, originalFile, contentType);
      });
  },
}