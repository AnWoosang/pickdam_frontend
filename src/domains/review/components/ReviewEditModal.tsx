'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Upload, X, Heart, Wind, Zap, Droplets, Info } from 'lucide-react';
import { BaseModal } from '@/shared/components/BaseModal';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { TextEditor } from '@/shared/components/TextEditor';
import { StarRating } from '@/domains/review/components/write-form/StarRating';
import { Review } from '@/domains/review/types/review';
import { useReviewEditForm } from '@/domains/review/hooks/useReviewEditForm';
import { useImageViewer } from '@/domains/image/hooks/useImageViewer';
import { getValidationErrorMessage, type ReviewValidationErrors } from '@/domains/review/validation/reviewValidation';
import { ALLOWED_MIME_TYPES } from '@/domains/image/validation/image';
import { toast } from 'react-hot-toast';

// 평점 옵션
const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;
const MAX_RATING = 5;

const DETAILED_RATINGS = [
  { field: 'sweetness' as const, label: '달콤함', icon: Heart, color: 'text-pink-500' },
  { field: 'menthol' as const, label: '멘솔감', icon: Wind, color: 'text-blue-500' },
  { field: 'throatHit' as const, label: '목넘김', icon: Zap, color: 'text-yellow-500' },
  { field: 'body' as const, label: '바디감', icon: Droplets, color: 'text-purple-500' },
  { field: 'freshness' as const, label: '신선함', icon: Info, color: 'text-green-500' },
] as const;

interface ReviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
  onSave: (updatedReview: Review) => Promise<void>;
}

export const ReviewEditModal = React.memo<ReviewEditModalProps>(function ReviewEditModal({
  isOpen,
  onClose,
  review,
  onSave
}) {
  // UI 상태 관리
  const [validationErrors, setValidationErrors] = useState<ReviewValidationErrors>({});

  const {
    formData,
    isSubmitting,
    hasChanges,
    uploadManager,
    handleImageUpload,
    handleFieldChange,
    validateForm,
  } = useReviewEditForm({
    review
  });

  const imageViewer = useImageViewer();

  const handleContentChange = React.useCallback((content: string) => {
    handleFieldChange('content', content);
  }, [handleFieldChange]);

  // 검증 에러 처리
  const handleValidationError = React.useCallback((errors: ReviewValidationErrors) => {
    setValidationErrors(errors);
    const errorMessage = getValidationErrorMessage(errors);
    toast.error(errorMessage || '필수 항목을 확인해주세요');
  }, []);

  // 제출 에러 처리
  const handleSubmitError = React.useCallback((message: string) => {
    toast.error(message || '리뷰 수정에 실패했습니다');
  }, []);

  // 성공 처리
  const handleSuccess = React.useCallback(() => {
    setValidationErrors({});
    onClose();
  }, [onClose]);

  const handleSave = React.useCallback(async () => {
    const validationResult = validateForm();

    if (!validationResult.isValid) {
      handleValidationError(validationResult.errors);
      return;
    }

    try {
      const imageUrls = await uploadManager.commitImages();

      const updateData: Review = {
        id: review.id,
        productId: review.productId,
        memberId: review.memberId,
        nickname: review.nickname,
        profileImageUrl: review.profileImageUrl,
        createdAt: review.createdAt,
        content: formData.content,
        rating: formData.rating,
        sweetness: formData.sweetness,
        menthol: formData.menthol,
        throatHit: formData.throatHit,
        body: formData.body,
        freshness: formData.freshness,
        images: imageUrls.map((url, index) => ({
          imageUrl: url,
          imageOrder: index + 1
        }))
      };

      await onSave(updateData);
      handleSuccess();
    } catch {
      handleSubmitError('리뷰 수정에 실패했습니다.');
    }
  }, [uploadManager, review, formData, onSave, handleValidationError, handleSubmitError, handleSuccess, validateForm]);

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  const isLoading = isSubmitting;

  // 평점 변경 핸들러
  const handleStarClick = React.useCallback(
    (rating: number) => {
      handleFieldChange('rating', rating);
    },
    [handleFieldChange]
  );

  const handleDetailedRatingChange = React.useCallback(
    (field: 'sweetness' | 'menthol' | 'throatHit' | 'body' | 'freshness') => (rating: number) => {
      handleFieldChange(field, rating);
    },
    [handleFieldChange]
  );


  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="리뷰 수정"
      size="large"
      preventBodyScroll={true}
    >
      <div className="space-y-6 p-6">
        {/* 전체 평점 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm font-medium text-gray-700">
              전체 평점 <span className="text-red-500">*</span>
            </label>
            <span className="text-sm text-gray-500">
              ({formData.rating}/{MAX_RATING})
            </span>
            {validationErrors.rating && (
              <span className="text-xs text-red-500">{validationErrors.rating}</span>
            )}
          </div>

          <div className="flex gap-1" role="radiogroup" aria-label="전체 평점 선택">
            {RATING_OPTIONS.map((star) => (
              <Star
                key={star}
                onClick={() => handleStarClick(star)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleStarClick(star);
                  }
                }}
                tabIndex={0}
                role="radio"
                aria-checked={star === formData.rating}
                aria-label={`${star}점`}
                className={`w-6 h-6 cursor-pointer transition-colors ${
                  star <= formData.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 hover:text-yellow-400'
                } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* 상세 평가 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">
              상세 평가 <span className="text-red-500">*</span>
            </label>
            {(validationErrors.sweetness || validationErrors.menthol || validationErrors.throatHit || validationErrors.body || validationErrors.freshness) && (
              <span className="text-xs text-red-500">모든 상세 평가를 선택해주세요</span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {DETAILED_RATINGS.map(({ field, label, icon, color }) => (
              <StarRating
                key={field}
                label={label}
                value={formData[field]}
                onChange={handleDetailedRatingChange(field)}
                icon={icon}
                color={color}
              />
            ))}
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div>
          <TextEditor
            content={formData.content}
            onContentChange={handleContentChange}
            placeholder="리뷰 내용을 입력해주세요..."
            rows={8}
            maxLength={1000}
            label="리뷰 내용"
            required
          />
          {validationErrors.content && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.content}</p>
          )}
        </div>

        {/* 이미지 업로드 섹션 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진 첨부 (선택)
          </label>
          
          {/* 이미지 미리보기 */}
          {uploadManager.imageStates.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {uploadManager.imageStates.map((imageState, index: number) => (
                <div key={imageState.id} className="relative w-20 h-20">
                  <div
                    className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-200"
                    onClick={() => imageViewer.openViewer(uploadManager.imageStates.map(state => state.previewUrl), index)}
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
                    icon={<X className="w-3 h-3" />}
                  />
                </div>
              ))}
            </div>
          )}

          {/* 이미지 업로드 버튼 */}
          {uploadManager.imageStates.length < 5 && (
            <div>
              <input
                ref={uploadManager.fileInputRef}
                type="file"
                id="image-upload-edit"
                multiple
                accept={ALLOWED_MIME_TYPES.join(',')}
                onChange={handleImageUpload}
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
                최대 5장까지 업로드 가능 (JPG, PNG) · 자동 압축 및 최적화
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
            disabled={isLoading || !hasChanges}
            isLoading={isLoading}
          >
            {isLoading ? '수정 중...' : '수정하기'}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
});