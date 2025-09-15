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
        <Button
          variant="secondary"
          size="medium"
          onClick={onCancel}
          disabled={isSubmitting}
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
            <Send className="w-4 h-4" />
          }
        >
          {isSubmitting ? '등록중...' : '리뷰 등록'}
        </Button>
      </div>
    </>
  );
}