import React from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useImageViewer } from '@/domains/image/hooks/useImageViewer';
import { useImageManager } from '@/domains/image/hooks/useImageManager';
import { IMAGE_CONFIG } from '@/domains/image/types/Image';
import { ALLOWED_MIME_TYPES } from '@/domains/image/validation/image';

interface ImageUploadManager {
  commitUploads: () => Promise<string[]>;
  resetImages: () => void;
  isUploading: boolean;
}

interface ReviewImageUploadProps {
  onImagesChange?: (imageUrls: string[]) => void;
  onGetUploadManager?: (manager: ImageUploadManager) => void;
}

export const ReviewImageUpload = React.memo(function ReviewImageUpload({ onImagesChange, onGetUploadManager }: ReviewImageUploadProps) {
  const imageViewer = useImageViewer();

  // 통합된 이미지 매니저 사용
  const uploadManager = useImageManager({
    contentType: 'reviews',
    mode: 'create',
  });

  // imageStates에서 필요한 데이터 계산
  const imageUrls = React.useMemo(() =>
    uploadManager.imageStates
      .filter(state => state.uploadedImage)
      .map(state => state.uploadedImage!.url),
    [uploadManager.imageStates]
  );

  const imagePreviewUrls = React.useMemo(() =>
    uploadManager.imageStates.map(state => state.previewUrl),
    [uploadManager.imageStates]
  );

  const maxImages = IMAGE_CONFIG.reviews.maxFiles;

  // 상위 컴포넌트에 현재 상태 직접 전달
  React.useEffect(() => {
    onImagesChange?.(imageUrls);
  }, [imageUrls, onImagesChange]);

  // 업로드 매니저 객체를 메모이제이션
  const managerObject = React.useMemo(() => ({
    commitUploads: uploadManager.commitImages,
    resetImages: uploadManager.resetImages,
    isUploading: uploadManager.isUploading,
  }), [uploadManager.commitImages, uploadManager.resetImages, uploadManager.isUploading]);

  React.useEffect(() => {
    onGetUploadManager?.(managerObject);
  }, [onGetUploadManager, managerObject]);

  // 핸들러들을 컴포넌트 최상위에서 정의
  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    uploadManager.addImages(files);
    // input 값 초기화
    if (e.target) {
      e.target.value = '';
    }
  }, [uploadManager]);

  const handleImageClick = React.useCallback((index: number) => {
    imageViewer.openViewer(imagePreviewUrls, index);
  }, [imageViewer, imagePreviewUrls]);

  const handleRemoveImage = React.useCallback((index: number) => {
    const imageState = uploadManager.imageStates[index];
    if (imageState) {
      uploadManager.removeImage(imageState.id);
    }
  }, [uploadManager]);

  return (
    <div>
      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
        사진 첨부 (선택)
      </label>

      {/* 이미지 미리보기 - blob URL 사용으로 즉시 표시 */}
      {imagePreviewUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
          {imagePreviewUrls.map((previewUrl, index) => (
            <div key={index} className="relative w-16 h-16 md:w-20 md:h-20">
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
                className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white rounded-full p-0 hover:bg-red-600 z-10"
                icon={<X className="w-2.5 h-2.5 md:w-3 md:h-3" />}
              />
            </div>
          ))}
        </div>
      )}

      {/* 이미지 업로드 버튼 */}
      {imagePreviewUrls.length < maxImages && (
        <div>
          <input
            ref={uploadManager.fileInputRef}
            type="file"
            id="image-upload"
            multiple
            accept={ALLOWED_MIME_TYPES.join(',')}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploadManager.isUploading}
          />
          <label
            htmlFor="image-upload"
            className={`inline-flex items-center space-x-1.5 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg transition-colors ${
              uploadManager.isUploading
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : 'cursor-pointer hover:bg-gray-50 text-gray-700'
            }`}
          >
            {uploadManager.isUploading ? (
              <>
                <LoadingSpinner size="small" showMessage={false} className="py-0" />
                <span className="text-xs md:text-sm">업로드 중...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
                <span className="text-xs md:text-sm">사진 선택</span>
              </>
            )}
          </label>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1">
            최대 {maxImages}장까지 업로드 가능 (JPG, PNG, JPEG, GIF)
          </p>
        </div>
      )}
    </div>
  );
});