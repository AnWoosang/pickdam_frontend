"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart
} from 'lucide-react';

import { Product } from '@/domains/product/types/product';
import { ProductCard } from '@/domains/product/components/ProductCard';
import {
  User,
} from '@/domains/user/types/user';
import { Button } from '@/shared/components/Button';
import { useWishlist } from '@/domains/user/hooks/wishlist/useWishlist';

interface WishlistDropdownProps {
  user: User | null;
  isActive: boolean;
  onToggle: () => void;
}

export function WishlistDropdown({ 
  user,
  isActive,
  onToggle
}: WishlistDropdownProps) {
  const router = useRouter();
  
  // 찜 상품 관리
  const { 
    wishlistProducts, 
    isLoading,
    handleRemoveSelected
  } = useWishlist({
    userId: user?.id,
    enabled: isActive
  });

  // UI 상태 관리
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const allWishlistProducts = wishlistProducts || [];

  // 페이지네이션 상태
  const [favoritePage, setFavoritePage] = useState(1);
  const itemsPerPage = 6; // 3x2 그리드
  
  // 페이지네이션 계산
  const getTotalPages = (products: Product[]) => Math.ceil(products.length / itemsPerPage);
  const getCurrentProducts = (products: Product[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleToggle = () => {
    if (isActive) {
      // 닫을 때 페이지 및 UI 상태 초기화
      setFavoritePage(1);
      setSelectedItems([]);
      setIsSelectionMode(false);
    }
    onToggle();
  };

  // UI 액션들
  const toggleSelectedItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const clearSelectedItems = () => {
    setSelectedItems([]);
  };
  
  const toggleSelectionMode = () => {
    setIsSelectionMode(prev => {
      if (prev) {
        setSelectedItems([]);
      }
      return !prev;
    });
  };

  const handleRemoveSelectedItems = async () => {
    try {
      await handleRemoveSelected(selectedItems);
      clearSelectedItems();
    } catch (error) {
      console.error('선택 삭제 실패:', error);
    }
  };


  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`flex items-center space-x-1 pb-1 transition-colors cursor-pointer
          ${isActive 
            ? 'text-textHeading border-b-2 border-primary' 
            : 'text-gray hover:text-textHeading'
          }`}
      >
        <Heart className="w-4 h-4" />
        <span className="text-sm font-semibold">찜한 상품</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isActive && (
        <div className="absolute top-full right-0 mt-2 w-[720px] bg-white border border-grayLight 
                      rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-textHeading">❤️ 찜한 상품이에요</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-hintText">총 {allWishlistProducts.length}개</span>
                {allWishlistProducts.length > 0 && (
                  <>
                    <Button
                      onClick={toggleSelectionMode}
                      variant={isSelectionMode ? "primary" : "ghost"}
                      size="small"
                      className="text-xs"
                      noFocus
                    >
                      {isSelectionMode ? "완료" : "선택"}
                    </Button>
                    {isSelectionMode && selectedItems.length > 0 && (
                      <Button
                        onClick={handleRemoveSelectedItems}
                        variant="destructive"
                        size="small"
                        className="text-xs"
                        noFocus
                      >
                        삭제 ({selectedItems.length})
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mx-auto mb-2" />
                <p className="text-sm text-hintText">찜한 상품을 불러오는 중...</p>
              </div>
            ) : allWishlistProducts.length > 0 ? (
              <>
                {/* 상품 카드 그리드 */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {getCurrentProducts(allWishlistProducts, favoritePage).map((product, index) => (
                    <div key={`favorite-${product?.id || index}-${index}`} className="scale-80 transform origin-center relative">
                      <ProductCard 
                        product={product} 
                        onClick={() => {
                          if (isSelectionMode) {
                            toggleSelectedItem(product.id);
                          } else {
                            router.push(`/product/${product.id}`);
                            onToggle(); // 드롭다운 닫기
                          }
                        }}
                      />
                      {isSelectionMode && (
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(product.id)}
                            onChange={() => toggleSelectedItem(product.id)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 bg-white"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* 페이지네이션 */}
                {getTotalPages(allWishlistProducts) > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-grayLight">
                    <Button
                      onClick={() => setFavoritePage(prev => Math.max(1, prev - 1))}
                      disabled={favoritePage === 1}
                      variant="ghost"
                      size="small"
                      icon={<ChevronLeft className="w-4 h-4" />}
                      noFocus
                    />
                    
                    <span className="text-sm text-textDefault">
                      {favoritePage} / {getTotalPages(allWishlistProducts)}
                    </span>
                    
                    <Button
                      onClick={() => setFavoritePage(prev => Math.min(getTotalPages(allWishlistProducts), prev + 1))}
                      disabled={favoritePage === getTotalPages(allWishlistProducts)}
                      variant="ghost"
                      size="small"
                      icon={<ChevronRight className="w-4 h-4" />}
                      noFocus
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <Heart className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-hintText">찜한 상품이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}