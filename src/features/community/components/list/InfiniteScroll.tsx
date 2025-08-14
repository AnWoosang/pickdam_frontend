'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface InfiniteScrollProps {
  children: React.ReactNode;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function InfiniteScroll({
  children,
  loading,
  hasMore,
  onLoadMore,
  threshold = 100,
}: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && !loading && hasMore) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  useEffect(() => {
    const element = loadingRef.current;
    if (!element) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0,
      rootMargin: `${threshold}px`,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  return (
    <div>
      {children}
      
      {/* 무한스크롤 트리거 요소 */}
      <div ref={loadingRef} className="flex justify-center py-4">
        {loading && (
          <div className="flex items-center gap-2">
            <LoadingSpinner />
            <span className="text-textDefault">게시글을 불러오는 중...</span>
          </div>
        )}
        {!loading && !hasMore && (
          <div className="text-center py-8">
            <p className="text-hintText">모든 게시글을 불러왔습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}