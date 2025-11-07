'use client';

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

interface GoogleAnalyticsProps {
  gaId: string;
}

/**
 * Google Analytics 컴포넌트
 *
 * @param gaId - Google Analytics Measurement ID (GA4)
 * @example
 * ```tsx
 * <GoogleAnalytics gaId="G-XXXXXXXXXX" />
 * ```
 */
export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  // 프로덕션 환경이 아니거나 GA ID가 없으면 렌더링하지 않음
  if (process.env.NODE_ENV !== 'production' || !gaId) {
    return null;
  }

  return <NextGoogleAnalytics gaId={gaId} />;
}

/**
 * GA 이벤트 전송 유틸리티 함수
 *
 * @param eventName - 이벤트 이름
 * @param eventParams - 이벤트 파라미터
 * @example
 * ```tsx
 * trackEvent('purchase', {
 *   currency: 'KRW',
 *   value: 10000,
 *   items: [{ item_id: 'product_123', item_name: 'Product Name' }]
 * })
 * ```
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * GA 페이지뷰 전송 유틸리티 함수
 *
 * @param url - 페이지 URL
 * @example
 * ```tsx
 * trackPageView('/products/123')
 * ```
 */
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
    });
  }
}

// gtag 타입 정의
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}