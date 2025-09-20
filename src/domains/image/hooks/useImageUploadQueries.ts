import { useMutation } from '@tanstack/react-query'
import { imageApi } from '../api/imageApi'
import type { Image, ImageUpload } from '../types/Image'

export const useImageUploadQuery = () => {
  return useMutation<Image[], Error, ImageUpload>({
    mutationFn: async (imageUpload) => {
      return await imageApi.uploadMultiple(imageUpload);
    }
  })
}