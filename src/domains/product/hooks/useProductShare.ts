'use client';

import toast from 'react-hot-toast';
import { Product } from '@/domains/product/types/product';

// 공유 관련 상수
const SHARE_MESSAGES = {
  SUCCESS: '링크가 클립보드에 복사되었습니다.',
  SHARE_FAILED: '공유에 실패했습니다.',
  CLIPBOARD_FAILED: '클립보드 복사에 실패했습니다.',
  TEMPLATE: (productName: string) => `${productName} - 픽담에서 최저가를 확인해보세요!`
} as const;

// URL 생성 헬퍼 함수
const getCurrentPageUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.href;
};

export const useProductShare = (product?: Product) => {
  // 공유하기 핸들러
  const handleShare = async () => {
    if (!product) return;
    
    const shareUrl = getCurrentPageUrl();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: SHARE_MESSAGES.TEMPLATE(product.name),
          url: shareUrl,
        });
      } catch (error: unknown) {
        // 사용자가 공유를 취소한 경우는 정상적인 동작이므로 토스트 표시 안 함
        if ((error as Error).name !== 'AbortError') {
          toast.error(SHARE_MESSAGES.SHARE_FAILED);
        }
      }
    } else {
      // 클립보드에 복사 (Web Share API 미지원시)
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success(SHARE_MESSAGES.SUCCESS);
      } catch (_error) {
        toast.error(SHARE_MESSAGES.CLIPBOARD_FAILED);
      }
    }
  };

  return {
    handleShare,
  };
};