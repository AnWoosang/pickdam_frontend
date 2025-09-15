export async function register() {
  // 개발 환경에서는 완전히 스킵 (모듈 로딩 방지)
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  // 프로덕션에서만 동적으로 Sentry 초기화
  try {
    const { initSentry } = await import('./src/infrastructure/monitoring/sentry');

    if (process.env.NEXT_RUNTIME === 'nodejs') {
      initSentry();
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      initSentry();
    }
  } catch (error) {
    // Sentry 초기화 실패 시 로그 (프로덕션에서만)
    console.error('Failed to initialize Sentry:', error);
  }
}

// React Server Components 에러 캐처 (개발환경에서는 비활성화)
export const onRequestError = process.env.NODE_ENV === 'development'
  ? undefined
  : async (error: unknown, request: any, context: any) => {
      try {
        const { captureRequestError } = await import('@sentry/nextjs');
        return captureRequestError(error, request, context);
      } catch (e) {
        console.error('Failed to capture request error:', e);
      }
    };