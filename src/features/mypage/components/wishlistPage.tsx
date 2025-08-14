'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { WishlistItem } from '@/types/user';

interface WishlistPageProps {
  className?: string;
}

// Mock 찜한 상품 데이터
const mockWishlistItems: WishlistItem[] = [
  {
    id: '1',
    productId: 'prod1',
    productName: 'JUUL Pod Classic Virginia',
    productImage: '/images/products/juul-pod.jpg',
    brand: 'JUUL',
    currentPrice: 25000,
    originalPrice: 30000,
    addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isAvailable: true,
  },
  {
    id: '2',
    productId: 'prod2',
    productName: 'IQOS ILUMA Prime Kit',
    productImage: '/images/products/iqos-iluma.jpg',
    brand: 'IQOS',
    currentPrice: 120000,
    originalPrice: 150000,
    addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isAvailable: true,
  },
  {
    id: '3',
    productId: 'prod3',
    productName: 'Vaporesso XROS 3 Pod Kit',
    productImage: '/images/products/vaporesso-xros.jpg',
    brand: 'Vaporesso',
    currentPrice: 45000,
    addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isAvailable: false,
  },
];

export function WishlistPage({ className = '' }: WishlistPageProps) {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(mockWishlistItems);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleBack = () => {
    router.push('/mypage');
  };

  const handleRemoveItem = (itemId: string) => {
    const confirmed = window.confirm('찜한 상품에서 제거하시겠습니까?');
    if (confirmed) {
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const availableItems = wishlistItems.filter(item => item.isAvailable);
    if (selectedItems.length === availableItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(availableItems.map(item => item.id));
    }
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) return;
    
    const confirmed = window.confirm(`선택한 ${selectedItems.length}개 상품을 찜한 상품에서 제거하시겠습니까?`);
    if (confirmed) {
      setWishlistItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const WishlistItemCard = React.memo(({ item }: { item: WishlistItem }) => (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${!item.isAvailable ? 'opacity-60' : ''}`}>
      <div className="flex items-start space-x-4">
        {/* 체크박스 */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => handleSelectItem(item.id)}
            disabled={!item.isAvailable}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50"
          />
        </div>

        {/* 상품 이미지 */}
        <div className="flex-shrink-0">
          <Link href={`/product/${item.productId}`}>
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400 text-xs">이미지</div>
              )}
            </div>
          </Link>
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link 
                href={`/product/${item.productId}`}
                className="block transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  {item.productName}
                </p>
                <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
              </Link>

              {/* 가격 정보 */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(item.currentPrice)}원
                </span>
                {item.originalPrice && item.originalPrice > item.currentPrice && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(item.originalPrice)}원
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      {Math.round((1 - item.currentPrice / item.originalPrice) * 100)}% 할인
                    </span>
                  </>
                )}
              </div>

              {/* 추가 정보 */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>찜한 날짜: {formatDate(item.addedAt)}</span>
                {!item.isAvailable && (
                  <span className="text-red-600 font-medium">품절</span>
                )}
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex flex-col space-y-2 ml-4">
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="p-2 text-gray-400 transition-colors"
                title="찜 제거"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              {item.isAvailable && (
                <Link
                  href={`/product/${item.productId}`}
                  className="p-2 text-gray-400 transition-colors"
                  title="장바구니 담기"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  WishlistItemCard.displayName = 'WishlistItemCard';

  const availableItems = wishlistItems.filter(item => item.isAvailable);

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로가기</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">찜한 상품</h1>
            <p className="text-gray-600 mt-1">
              총 {wishlistItems.length}개 상품 (구매 가능 {availableItems.length}개)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="font-medium">{wishlistItems.length}</span>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        /* 빈 상태 */
        <div className="text-center py-16">
          <div className="mb-4">
            <Heart className="w-16 h-16 mx-auto text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">찜한 상품이 없습니다</h3>
          <p className="text-gray-600 mb-6">마음에 드는 상품을 찜해보세요!</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary transition-colors"
          >
            상품 둘러보기
          </Link>
        </div>
      ) : (
        <>
          {/* 일괄 작업 툴바 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === availableItems.length && availableItems.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium">전체 선택 ({selectedItems.length}/{availableItems.length})</span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRemoveSelected}
                  disabled={selectedItems.length === 0}
                  className="px-3 py-2 text-sm text-red-600 disabled:text-gray-400 transition-colors"
                >
                  선택 삭제
                </button>
              </div>
            </div>
          </div>

          {/* 찜한 상품 목록 */}
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <WishlistItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* 하단 액션 바 */}
          {selectedItems.length > 0 && (
            <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{selectedItems.length}개 선택</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRemoveSelected}
                    className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md transition-colors"
                  >
                    삭제
                  </button>
                  <button
                    className="px-4 py-2 text-sm text-white bg-primary rounded-md transition-colors"
                    onClick={() => {
                      // 구현 예정: 선택된 상품들을 장바구니에 추가
                      console.log('장바구니에 추가:', selectedItems);
                    }}
                  >
                    장바구니 담기
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}