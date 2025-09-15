'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/domains/product/types/product';

// 상수 분리
const STORAGE_CONFIG = {
  KEY: 'pickdam_recent_products',
  MAX_PRODUCTS: 20,
} as const;

// 에러 메시지 통합
const ERROR_MESSAGES = {
  LOAD_FAILED: '최근 본 상품을 불러오는데 실패했습니다.',
  SAVE_FAILED: '최근 본 상품 저장에 실패했습니다.',
  REMOVE_FAILED: '상품 제거에 실패했습니다.',
  CLEAR_FAILED: '전체 삭제에 실패했습니다.',
  INVALID_DATA: '저장된 데이터가 올바르지 않습니다.',
} as const;

interface RecentProduct {
  productId: string;
  viewedAt: string;
  productData: Product;
}

// 타입 가드 함수들
function isValidRecentProduct(item: unknown): item is RecentProduct {
  return typeof item === 'object' && item !== null && 'productId' in item;
}

function isRecentProductArray(data: unknown): data is RecentProduct[] {
  return Array.isArray(data) && data.every(isValidRecentProduct);
}

// localStorage 안전한 접근 함수
function safeLocalStorageAccess<T>(
  operation: () => T,
  fallback: T,
  errorMessage: string
): T {
  if (typeof window === 'undefined') return fallback;
  
  try {
    return operation();
  } catch (error) {
    console.error(errorMessage, error);
    return fallback;
  }
}

// 최근 본 상품 목록 조회 (내부 함수)
function getRecentProducts(): Product[] {
  return safeLocalStorageAccess(
    () => {
      const stored = localStorage.getItem(STORAGE_CONFIG.KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (!isRecentProductArray(parsed)) {
        console.warn(ERROR_MESSAGES.INVALID_DATA);
        return [];
      }
      
      // 데이터 유효성 검사 및 ID 일관성 확보
      const validProducts = parsed.filter(item => {
        // ID 일관성 확보 (mutating이지만 필요한 정리 작업)
        if (!item.productId && item.productData.id) {
          item.productId = item.productData.id;
        }
        if (!item.productData.id && item.productId) {
          item.productData.id = item.productId;
        }
        return item.productId === item.productData.id;
      });
      
      // 최신 순으로 정렬하고 Product 데이터만 반환
      return validProducts
        .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
        .map(item => item.productData);
    },
    [],
    ERROR_MESSAGES.LOAD_FAILED
  );
}

// 최근 본 상품에 추가 (내부 함수)
function addRecentProduct(product: Product): boolean {
  if (!product.id) return false;
  
  return safeLocalStorageAccess(
    () => {
      const stored = localStorage.getItem(STORAGE_CONFIG.KEY);
      const currentProducts = stored ? JSON.parse(stored) : [];
      let recentProducts: RecentProduct[] = isRecentProductArray(currentProducts) 
        ? currentProducts 
        : [];
      
      // 중복 제거 (최신으로 업데이트)
      recentProducts = recentProducts.filter(item => item.productId !== product.id);
      
      // 새로운 상품을 맨 앞에 추가
      const newItem: RecentProduct = {
        productId: product.id,
        viewedAt: new Date().toISOString(),
        productData: product
      };
      recentProducts.unshift(newItem);
      
      // 최대 개수 제한
      if (recentProducts.length > STORAGE_CONFIG.MAX_PRODUCTS) {
        recentProducts = recentProducts.slice(0, STORAGE_CONFIG.MAX_PRODUCTS);
      }
      
      localStorage.setItem(STORAGE_CONFIG.KEY, JSON.stringify(recentProducts));
      return true;
    },
    false,
    ERROR_MESSAGES.SAVE_FAILED
  );
}

// 최근 본 상품에서 제거 (내부 함수)
function removeRecentProduct(productId: string): boolean {
  return safeLocalStorageAccess(
    () => {
      const stored = localStorage.getItem(STORAGE_CONFIG.KEY);
      if (!stored) return true; // 이미 없으므로 성공으로 간주
      
      const parsed = JSON.parse(stored);
      if (!isRecentProductArray(parsed)) {
        console.warn(ERROR_MESSAGES.INVALID_DATA);
        return false;
      }
      
      const filtered = parsed.filter(item => item.productId !== productId);
      localStorage.setItem(STORAGE_CONFIG.KEY, JSON.stringify(filtered));
      return true;
    },
    false,
    ERROR_MESSAGES.REMOVE_FAILED
  );
}

// 최근 본 상품 전체 삭제 (내부 함수)
function clearRecentProducts(): boolean {
  return safeLocalStorageAccess(
    () => {
      localStorage.removeItem(STORAGE_CONFIG.KEY);
      return true;
    },
    false,
    ERROR_MESSAGES.CLEAR_FAILED
  );
}

export const useRecentProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 상품 목록 새로고침
  const refreshProducts = useCallback(() => {
    const recentProducts = getRecentProducts();
    setProducts(recentProducts);
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    const loadRecentProducts = () => {
      setIsLoading(true);
      try {
        refreshProducts();
      } catch (error) {
        console.error('최근 본 상품 로드 실패:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentProducts();
    
    // 다른 탭에서 최근 본 상품이 업데이트될 때를 대비
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_CONFIG.KEY) {
        refreshProducts();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshProducts]);

  // 최근 본 상품에 추가
  const addProduct = useCallback((product: Product) => {
    const success = addRecentProduct(product);
    if (success) {
      refreshProducts();
    }
    return success;
  }, [refreshProducts]);

  // 최근 본 상품에서 제거
  const removeProduct = useCallback((productId: string) => {
    const success = removeRecentProduct(productId);
    if (success) {
      refreshProducts();
    }
    return success;
  }, [refreshProducts]);

  // 모든 최근 본 상품 삭제
  const clearAll = useCallback(() => {
    const success = clearRecentProducts();
    if (success) {
      setProducts([]);
    }
    return success;
  }, []);

  // 특정 상품이 최근 본 상품에 있는지 확인
  const hasProduct = useCallback((productId: string) => {
    return products.some(product => product.id === productId);
  }, [products]);


  return {
    // 데이터
    products,
    count: products.length,
    
    // 액션
    addProduct,
    removeProduct,
    clearAll,
    hasProduct,
    
    // 상태
    isLoading
  };
};