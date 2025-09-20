"use client";

import { useCallback } from 'react';
import { Product } from '@/domains/product/types/product';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useWishlistMutation, useWishlistStatusQuery } from '@/domains/user/hooks/wishlist/useWishlistQuery';
import { useProductShare } from '@/domains/product/hooks/useProductShare';
import { toast } from 'react-hot-toast';

interface UseProductImageGalleryOptions {
  product: Product;
}

export const useProductImageGallery = ({ product }: UseProductImageGalleryOptions) => {
  const { handleShare } = useProductShare(product);
  const { user } = useAuthUtils();
  
  // 개별 찜 상태 조회
  const { data: wishlistData } = useWishlistStatusQuery(user?.id, product.id);
  const isWishlisted = wishlistData?.isWishlisted;
  
  // 찜하기 뮤테이션
  const wishlistMutation = useWishlistMutation();

  // 찜하기 핸들러
  const handleWishlistToggle = useCallback(() => {
    if (user?.id) {
      wishlistMutation.mutate(
        { memberId: user.id, productId: product.id },
        {
          onSuccess: (result) => {
            // 성공 토스트 표시
            if (result.isWishlisted) {
              toast.success('찜 목록에 추가되었습니다');
            } else {
              toast.success('찜 목록에서 제거되었습니다');
            }
          }
        }
      );
    }
  }, [wishlistMutation, user?.id, product.id]);
  
  // 이미지 배열 생성
  const images = [
    product.thumbnailImageUrl,
    // 추가 이미지가 있다면 여기에 추가 (현재는 실제 이미지만 표시)
  ].filter(Boolean);

  return {
    // 데이터
    images,
    user,
    isWishlisted,
    
    // 핸들러
    handleShare,
    handleWishlistToggle
  };
};