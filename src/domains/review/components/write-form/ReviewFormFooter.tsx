import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

interface ReviewFormFooterProps {
  isSubmitting: boolean;
  isUploading: boolean;
  onCancel: () => void;
}

export function ReviewFormFooter({
  isSubmitting,
  isUploading,
  onCancel
}: ReviewFormFooterProps) {
  return (
    <>
      {/* 주의사항 */}
      <div className="p-2 md:p-4 bg-gray-50 rounded-lg">
        <h4 className="text-xs md:text-sm font-medium text-gray-900 mb-1 md:mb-2">리뷰 작성 안내</h4>
        <ul className="text-[10px] md:text-xs text-gray-600 space-y-0.5 md:space-y-1">
          <li>• 상품과 무관한 내용, 욕설, 개인정보 등은 삭제될 수 있습니다</li>
          <li>• 다른 회원에게 도움이 되는 솔직하고 자세한 리뷰를 작성해주세요</li>
          <li>• 작성된 리뷰는 수정이 어려우니 신중하게 작성해주세요</li>
        </ul>
      </div>

      {/* 제출 버튼 */}
      <div className="flex items-center space-x-2 md:space-x-3">
        <Button
          variant="secondary"
          size="medium"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2"
        >
          취소
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="medium"
          disabled={isSubmitting || isUploading}
          icon={isSubmitting ?
            <LoadingSpinner size="small" showMessage={false} className="py-0" /> :
            <Send className="w-3 h-3 md:w-4 md:h-4" />
          }
          className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2"
        >
          {isSubmitting ? '등록중...' : '리뷰 등록'}
        </Button>
      </div>
    </>
  );
}