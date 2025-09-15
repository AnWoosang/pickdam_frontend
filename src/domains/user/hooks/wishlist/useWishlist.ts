'use client';

import { useWishlistQuery, useWishlistMutation } from './useWishlistQuery';
import { removeMultipleFromWishlist } from '../../api/wishlistApi';
import { toast } from 'react-hot-toast';

interface UseWishlistProps {
  userId?: string;
  page?: number;
  productsPerPage?: number;
  enabled?: boolean;
}

export function useWishlist({ 
  userId, 
  page = 1,
  productsPerPage = 20,
  enabled = true
}: UseWishlistProps = {}) {
  
  // React Query로 페이지네이션된 데이터 가져오기
  const { data: wishlistData, isLoading, refetch } = useWishlistQuery(userId, page, productsPerPage, enabled);
  const wishlistMutation = useWishlistMutation();
  const wishlistProducts = wishlistData?.data || [];
  const pagination = wishlistData?.pagination;

  // 개별 상품 삭제
  const handleRemoveProduct = async (productId: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      const result = await wishlistMutation.mutateAsync({ memberId: userId, productId });
      
      // 성공 토스트 표시
      if (result.isWishlisted) {
        toast.success('찜 목록에 추가되었습니다');
      } else {
        toast.success('찜 목록에서 제거되었습니다');
      }
      
      // React Query가 자동으로 캐시 업데이트
      await refetch();
      
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // 선택된 상품들 삭제
  const handleRemoveSelected = async (selectedItems: string[]): Promise<boolean> => {
    if (!userId || selectedItems.length === 0) return false;

    try {
      const result = await removeMultipleFromWishlist(userId, selectedItems);
      
      if (result.success) {
        // React Query가 자동으로 캐시 업데이트
        await refetch();
        
        return true;
      }
      
      return false;
    } catch (error) {
      throw error;
    }
  };
  
  // 전체 삭제 (현재 페이지의 모든 상품)
  const handleClearAll = async (): Promise<boolean> => {
    if (!userId || wishlistProducts.length === 0) return false;

    try {
      const productIds = wishlistProducts.map(product => product.id);
      const result = await removeMultipleFromWishlist(userId, productIds);
      
      if (result.success) {
        // React Query가 자동으로 캐시 업데이트
        await refetch();
        
        return true;
      }
      
      return false;
    } catch (error) {
      throw error;
    }
  };
  
  
  // 데이터 새로고침
  const refreshWishlist = async () => {
    await refetch();
  };
  

  return {
    // 데이터
    wishlistProducts,
    pagination,
    isLoading,
    
    // 액션
    handleRemoveProduct,
    handleRemoveSelected,
    handleClearAll,
    refreshWishlist
  };
}