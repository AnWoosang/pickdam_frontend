import React from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useImageViewer } from '@/domains/image/hooks/useImageViewer';
import { useNewImageManager } from '@/domains/image/hooks/useNewImageManager';
import { Image as ImageType } from '@/domains/image/types/Image';

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/jpg,image/png,image/webp,image/gif';

interface ImageUploadManager {
  commitUploads: () => Promise<ImageType[]>;
  resetImages: () => void;
  isUploading: boolean;
}

interface ReviewImageUploadProps {
  onImagesChange?: (imageUrls: string[]) => void;
  onUploadError?: (error: string) => void;
  onGetUploadManager?: (manager: ImageUploadManager) => void;
}

export const ReviewImageUpload = React.memo(function ReviewImageUpload({ onImagesChange, onUploadError, onGetUploadManager }: ReviewImageUploadProps) {
  const imageViewer = useImageViewer();
  
  // 직접 이미지 매니저 사용
  const uploadManager = useNewImageManager({
    contentType: 'review',
    onUploadError: React.useCallback((error: string) => {
      onUploadError?.(error);
    }, [onUploadError]),
  });

  // 상위 컴포넌트에 현재 상태 직접 전달
  React.useEffect(() => {
    onImagesChange?.(uploadManager.imageUrls);
  }, [uploadManager.imageUrls, onImagesChange]);

  // 업로드 매니저 객체를 메모이제이션
  const managerObject = React.useMemo(() => ({
    commitUploads: uploadManager.commitUploads,
    resetImages: uploadManager.resetImages,
    isUploading: uploadManager.isUploading,
  }), [uploadManager.commitUploads, uploadManager.resetImages, uploadManager.isUploading]);

  React.useEffect(() => {
    onGetUploadManager?.(managerObject);
  }, [onGetUploadManager, managerObject]);

  // 핸들러들을 컴포넌트 최상위에서 정의
  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    uploadManager.addImages(files);
  }, [uploadManager]);

  const handleImageClick = React.useCallback((index: number) => {
    imageViewer.openViewer(uploadManager.imagePreviewUrls, index);
  }, [imageViewer, uploadManager.imagePreviewUrls]);

  const handleRemoveImage = React.useCallback((index: number) => {
    uploadManager.removeImage(index);
  }, [uploadManager]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        사진 첨부 (선택)
      </label>
      
      {/* 이미지 미리보기 - blob URL 사용으로 즉시 표시 */}
      {uploadManager.imagePreviewUrls.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {uploadManager.imagePreviewUrls.map((previewUrl, index) => (
            <div key={index} className="relative w-20 h-20">
              <div
                className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-200"
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={previewUrl}
                  alt={`미리보기 ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full p-0 hover:bg-red-600 z-10"
                icon={<X className="w-3 h-3" />}
              />
            </div>
          ))}
        </div>
      )}

      {/* 이미지 업로드 버튼 */}
      {uploadManager.imagePreviewUrls.length < uploadManager.maxImages && (
        <div>
          <input
            ref={uploadManager.fileInputRef}
            type="file"
            id="image-upload"
            multiple
            accept={ACCEPTED_IMAGE_TYPES}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploadManager.isUploading}
          />
          <label
            htmlFor="image-upload"
            className={`inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
              uploadManager.isUploading 
                ? 'cursor-not-allowed bg-gray-100 text-gray-400' 
                : 'cursor-pointer hover:bg-gray-50 text-gray-700'
            }`}
          >
            {uploadManager.isUploading ? (
              <>
                <LoadingSpinner size="small" showMessage={false} className="py-0" />
                <span className="text-sm">업로드 중...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-gray-600" />
                <span className="text-sm">사진 선택</span>
              </>
            )}
          </label>
          <p className="text-xs text-gray-500 mt-1">
            최대 {uploadManager.maxImages}장까지 업로드 가능 (JPG, PNG) · 자동 압축 및 최적화
          </p>
        </div>
      )}
    </div>
  );
});