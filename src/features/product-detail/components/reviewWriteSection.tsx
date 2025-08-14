'use client';

import React, { useState } from 'react';
import { Star, Upload, X, Heart, Wind, Zap, Droplets, Info, Send } from 'lucide-react';

interface ReviewWriteSectionProps {
  productId?: string;
  className?: string;
}

interface ReviewFormData {
  rating: number;
  content: string;
  sweetness: number;
  menthol: number;
  throatHit: number;
  body: number;
  freshness: number;
  images: File[];
}

export function ReviewWriteSection({ productId, className = '' }: ReviewWriteSectionProps) {
  const [isWriting, setIsWriting] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    content: '',
    sweetness: 0,
    menthol: 0,
    throatHit: 0,
    body: 0,
    freshness: 0,
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (field: keyof ReviewFormData, rating: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: rating
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5) // 최대 5개
    }));
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (formData.rating === 0) {
      alert('전체 평점을 선택해주세요.');
      return;
    }
    
    if (formData.content.trim().length < 10) {
      alert('리뷰 내용을 10자 이상 작성해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 구현 예정: API 호출
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
      
      alert('리뷰가 등록되었습니다!');
      setIsWriting(false);
      setFormData({
        rating: 0,
        content: '',
        sweetness: 0,
        menthol: 0,
        throatHit: 0,
        body: 0,
        freshness: 0,
        images: [],
      });
    } catch {
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (
    label: string,
    value: number,
    onChange: (rating: number) => void,
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>,
    color?: string
  ) => {
    const IconComponent = icon;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {IconComponent && <IconComponent className={`w-4 h-4 ${color}`} />}
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">({value}/5)</span>
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
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
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!isWriting) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">리뷰 작성</h3>
          <p className="text-gray-600 mb-4">
            이 상품을 사용해보셨나요? 다른 사용자들에게 도움이 되는 리뷰를 작성해주세요!
          </p>
          <button
            onClick={() => setIsWriting(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg transition-colors"
          >
            리뷰 작성하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">리뷰 작성</h3>
          <button
            onClick={() => setIsWriting(false)}
            className="text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* 전체 평점 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            전체 평점 <span className="text-red-500">*</span>
          </label>
          {renderStarRating(
            '',
            formData.rating,
            (rating) => handleRatingChange('rating', rating)
          )}
        </div>

        {/* 상세 평가 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            상세 평가
          </label>
          <div className="grid grid-cols-2 gap-4">
            {renderStarRating(
              '달콤함',
              formData.sweetness,
              (rating) => handleRatingChange('sweetness', rating),
              Heart,
              'text-pink-500'
            )}
            {renderStarRating(
              '멘솔감',
              formData.menthol,
              (rating) => handleRatingChange('menthol', rating),
              Wind,
              'text-blue-500'
            )}
            {renderStarRating(
              '목넘김',
              formData.throatHit,
              (rating) => handleRatingChange('throatHit', rating),
              Zap,
              'text-yellow-500'
            )}
            {renderStarRating(
              '바디감',
              formData.body,
              (rating) => handleRatingChange('body', rating),
              Droplets,
              'text-purple-500'
            )}
            {renderStarRating(
              '신선함',
              formData.freshness,
              (rating) => handleRatingChange('freshness', rating),
              Info,
              'text-green-500'
            )}
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            리뷰 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="상품에 대한 솔직한 후기를 작성해주세요. (최소 10자)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            rows={4}
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">
              최소 10자, 최대 1000자
            </span>
            <span className="text-xs text-gray-500">
              {formData.content.length}/1000
            </span>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진 첨부 (선택)
          </label>
          
          {/* 업로드된 이미지 미리보기 */}
          {formData.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`미리보기 ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 이미지 업로드 버튼 */}
          {formData.images.length < 5 && (
            <div>
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">사진 선택</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                최대 5장까지 업로드 가능 (JPG, PNG)
              </p>
            </div>
          )}
        </div>

        {/* 주의사항 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">리뷰 작성 안내</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 상품과 무관한 내용, 욕설, 개인정보 등은 삭제될 수 있습니다</li>
            <li>• 다른 회원에게 도움이 되는 솔직하고 자세한 리뷰를 작성해주세요</li>
            <li>• 작성된 리뷰는 수정이 어려우니 신중하게 작성해주세요</li>
          </ul>
        </div>

        {/* 제출 버튼 */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsWriting(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            취소
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || formData.rating === 0 || formData.content.trim().length < 10}
            className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>등록중...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>리뷰 등록</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}