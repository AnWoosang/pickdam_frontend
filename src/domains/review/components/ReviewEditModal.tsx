'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Upload, X } from 'lucide-react';
import { BaseModal } from '@/shared/components/BaseModal';
import { Button } from '@/shared/components/Button';
import { TextEditor } from '@/shared/components/TextEditor';
import { Review } from '@/domains/review/types/review';
import { useReviewEditForm } from '@/domains/review/hooks/useReviewEditForm';
import { useImageViewer } from '@/domains/image/hooks/useImageViewer';

// 평점 옵션
const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

interface ReviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
  onSave: (updatedReview: Partial<Review>) => Promise<void>;
}

export const ReviewEditModal = React.memo<ReviewEditModalProps>(function ReviewEditModal({
  isOpen,
  onClose,
  review,
  onSave
}) {
  const {
    formData,
    isSubmitting,
    uploadManager,
    fileHandlers,
    handleFieldChange,
    handleSubmit,
  } = useReviewEditForm({
    review,
    onSubmit: onSave,
    onError: (error) => {
      console.error('리뷰 수정 오류:', error);
    }
  });

  const imageViewer = useImageViewer();

  const handleContentChange = React.useCallback((content: string) => {
    handleFieldChange('content', content);
  }, [handleFieldChange]);

  const handleSave = React.useCallback(async () => {
    const result = await handleSubmit();
    if (result.success) {
      onClose();
    }
  }, [handleSubmit, onClose]);

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  const isLoading = isSubmitting;

  // 평점 변경 핸들러들
  const ratingChangeHandlers = React.useMemo(() => ({
    rating: (value: number) => handleFieldChange('rating', value),
    sweetness: (value: number) => handleFieldChange('sweetness', value),
    menthol: (value: number) => handleFieldChange('menthol', value),
    throatHit: (value: number) => handleFieldChange('throatHit', value),
    body: (value: number) => handleFieldChange('body', value),
    freshness: (value: number) => handleFieldChange('freshness', value),
  }), [handleFieldChange]);

  // 평점 선택 컴포넌트
  const RatingSelector = React.useCallback(({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (value: number) => void; 
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex space-x-1">
        {RATING_OPTIONS.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${
                star <= value
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              } hover:text-yellow-400`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-500 mt-1">{value}/5</span>
    </div>
  ), []);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="리뷰 수정"
      size="large"
    >
      <div className="space-y-6">
        {/* 전체 평점 */}
        <RatingSelector
          label="전체 평점"
          value={formData.rating}
          onChange={ratingChangeHandlers.rating}
        />

        {/* 세부 평점 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <RatingSelector
            label="달콤함"
            value={formData.sweetness}
            onChange={ratingChangeHandlers.sweetness}
          />
          <RatingSelector
            label="멘솔감"
            value={formData.menthol}
            onChange={ratingChangeHandlers.menthol}
          />
          <RatingSelector
            label="목넘김"
            value={formData.throatHit}
            onChange={ratingChangeHandlers.throatHit}
          />
          <RatingSelector
            label="바디감"
            value={formData.body}
            onChange={ratingChangeHandlers.body}
          />
          <RatingSelector
            label="신선함"
            value={formData.freshness}
            onChange={ratingChangeHandlers.freshness}
          />
        </div>

        {/* 리뷰 내용 */}
        <TextEditor
          content={formData.content}
          onContentChange={handleContentChange}
          onPaste={fileHandlers.handlePaste}
          onDragOver={fileHandlers.handleDragOver}
          onDragLeave={fileHandlers.handleDragLeave}
          onDrop={fileHandlers.handleDrop}
          isDragOver={fileHandlers.isDragOver}
          placeholder="리뷰 내용을 입력해주세요..."
          rows={8}
          maxLength={2000}
          label="리뷰 내용"
          required
        />

        {/* 이미지 업로드 섹션 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진 첨부 (선택)
          </label>
          
          {/* 기존 이미지 미리보기 */}
          {uploadManager.activeImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {uploadManager.activeImages.map((imageState, index: number) => (
                <div key={imageState.id} className="relative w-20 h-20">
                  <div 
                    className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => imageViewer.openViewer(uploadManager.allImagePreviewUrls, index)}
                  >
                    <Image
                      src={imageState.previewUrl}
                      alt={`미리보기 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => uploadManager.removeImage(imageState.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full p-0 hover:bg-red-600 z-10"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* 이미지 업로드 버튼 */}
          {uploadManager.activeImages.length < uploadManager.maxImages && (
            <div>
              <input
                ref={uploadManager.fileInputRef}
                type="file"
                id="image-upload-edit"
                multiple
                accept="image/*"
                onChange={fileHandlers.handleImageUpload}
                className="hidden"
                disabled={uploadManager.isUploading}
              />
              <label
                htmlFor="image-upload-edit"
                className={`inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
                  uploadManager.isUploading 
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400' 
                    : 'cursor-pointer hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">
                  {uploadManager.isUploading ? '업로드 중...' : '사진 선택'}
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                최대 {uploadManager.maxImages}장까지 업로드 가능
              </p>
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? '수정 중...' : '수정하기'}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
});