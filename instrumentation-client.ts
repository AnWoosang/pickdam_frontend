import * as Sentry from '@sentry/nextjs';
import { initSentry } from './src/infrastructure/monitoring/sentry';

// 클라이언트 사이드 Sentry 초기화
initSentry();

// Next.js 네비게이션 추적을 위한 hook
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;