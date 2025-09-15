import * as Sentry from '@sentry/nextjs';

/**
 * Sentry 초기화 설정
 */
export const initSentry = () => {
  // 개발 환경에서는 Sentry 완전 비활성화
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    
    // 환경 설정
    environment: process.env.NODE_ENV,
    
    // 성능 모니터링 (개발환경에서는 비활성화)
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.0,
    
    // 세션 재생 (개발환경에서는 비활성화)
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.0,
    replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0.0,
    
    // 디버그 모드 (필요시에만 활성화)
    debug: false,
    
    // 오류 필터링
    beforeSend(event, hint) {
      // 개발 환경에서는 콘솔에도 출력
      if (process.env.NODE_ENV === 'development') {
        console.error('Sentry Error:', hint.originalException);
      }
      
      // 민감한 정보 제거
      if (event.request?.url?.includes('/api/auth')) {
        return null;
      }
      
      return event;
    },
    
    // 통합 설정
    integrations: [
      // replayIntegration은 현재 버전에서 지원되지 않음
    ],
  });
};

/**
 * 에러 로깅 유틸리티
 */
export const logError = (
  error: unknown,
  context: string,
  extra?: Record<string, unknown>
) => {
  // 개발 환경에서는 콘솔에만 출력
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error, extra);
    return;
  }
  
  Sentry.withScope((scope) => {
    scope.setTag('context', context);
    scope.setLevel('error');
    
    if (extra) {
      scope.setExtras(extra);
    }
    
    Sentry.captureException(error);
  });
};

/**
 * 사용자 컨텍스트 설정
 */
export const setUserContext = (user: {
  id: string;
  email?: string;
  username?: string;
}) => {
  // 개발 환경에서는 실행하지 않음
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
};

/**
 * 커스텀 이벤트 로깅
 */
export const logEvent = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  extra?: Record<string, unknown>
) => {
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    
    if (extra) {
      scope.setExtras(extra);
    }
    
    Sentry.captureMessage(message, level);
  });
};

/**
 * 성능 측정
 */
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  return Sentry.startSpan(
    {
      name,
      op: 'function',
    },
    fn
  );
};