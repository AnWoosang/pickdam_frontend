"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Clock, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { ProductCard } from '@/domains/product/components/ProductCard';
import { Product } from '@/domains/product/types/product';
import { Button } from '@/shared/components/Button';
import { useRecentProducts } from '@/domains/user/hooks/useRecentProducts';

interface RecentProductsDropdownProps {
  isActive: boolean;
  onToggle: () => void;
}

export function RecentProductsDropdown({ 
  isActive, 
  onToggle
}: RecentProductsDropdownProps) {
  const router = useRouter();
  const { 
    products: recentViewedProducts, 
    removeProduct: removeRecentProduct, 
    clearAll: clearRecentProducts
  } = useRecentProducts();
  
  // 페이지네이션 상태
  const [recentPage, setRecentPage] = useState(1);
  const itemsPerPage = 6; // 3x2 그리드
  
  // 페이지네이션 계산
  const getTotalPages = (products: Product[]) => Math.ceil(products.length / itemsPerPage);
  const getCurrentProducts = (products: Product[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleToggle = () => {
    if (isActive) {
      // 닫을 때 페이지 초기화
      setRecentPage(1);
    }
    onToggle();
  };

  // 개별 최근 상품 삭제
  const handleRemoveRecentProduct = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentProduct(productId);
  };

  // 전체 최근 상품 삭제
  const handleClearAllRecentProducts = () => {
    clearRecentProducts();
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
        <Clock className="w-4 h-4" />
        <span className="text-sm font-semibold">최근 본 상품</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isActive && (
        <div className="absolute top-full right-0 mt-2 w-[720px] bg-white border border-grayLight 
                      rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-textHeading">🔥 최근에 조회하신 상품이에요</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-hintText">총 {recentViewedProducts.length}개</span>
                {recentViewedProducts.length > 0 && (
                  <Button
                    onClick={handleClearAllRecentProducts}
                    variant="ghost"
                    size="small"
                    icon={<Trash2 className="w-3 h-3" />}
                    className="text-gray-500 hover:text-red-500 p-1"
                    noFocus
                  />
                )}
              </div>
            </div>
            
            {recentViewedProducts.length > 0 ? (
              <>
                {/* 상품 카드 그리드 */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {getCurrentProducts(recentViewedProducts, recentPage).map((product, index) => {
                    return (
                    <div key={`recent-${product?.id || index}-${index}`} className="scale-80 transform origin-center relative">
                      <ProductCard 
                        product={product} 
                        onClick={() => {
                          router.push(`/product/${product.id}`);
                          onToggle(); // 드롭다운 닫기
                        }}
                      />
                      {/* 개별 삭제 버튼 */}
                      <button
                        onClick={(e) => handleRemoveRecentProduct(product.id, e)}
                        className="absolute top-2 left-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer z-10"
                        aria-label="최근 상품에서 제거"
                      >
                        <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                    );
                  })}
                </div>
                
                {/* 페이지네이션 */}
                {getTotalPages(recentViewedProducts) > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-grayLight">
                    <Button
                      onClick={() => setRecentPage(prev => Math.max(1, prev - 1))}
                      disabled={recentPage === 1}
                      variant="ghost"
                      size="small"
                      icon={<ChevronLeft className="w-4 h-4" />}
                      noFocus
                    />
                    
                    <span className="text-sm text-textDefault">
                      {recentPage} / {getTotalPages(recentViewedProducts)}
                    </span>
                    
                    <Button
                      onClick={() => setRecentPage(prev => Math.min(getTotalPages(recentViewedProducts), prev + 1))}
                      disabled={recentPage === getTotalPages(recentViewedProducts)}
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
                <Clock className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-hintText">최근 본 상품이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}