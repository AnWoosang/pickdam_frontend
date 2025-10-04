import { withSentryConfig } from '@sentry/nextjs';
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from "next";

// 환경 감지 (표준 NODE_ENV 사용)
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  // 개발 환경에서는 React Strict Mode 비활성화 (중복 요청 방지)
  reactStrictMode: !isDev,

  // 소스맵 완전 비활성화 (성능 향상)
  productionBrowserSourceMaps: false,
  
  webpack: (config, { dev, isServer, nextRuntime }) => {
    if (dev) {
      // 개발 환경에서 소스맵 비활성화
      config.devtool = false;

      // 캐시 최적화 (Next.js 15 호환)
      config.cache = {
        type: 'filesystem'
      };

      // resolve 최적화
      config.resolve.symlinks = false;

      // 모듈 분석을 위한 플러그인 추가
      if (process.env.ANALYZE_MODULES === 'true') {
        const ModuleAnalyzerPlugin = {
          apply(compiler: any) {
            compiler.hooks.emit.tap('ModuleAnalyzerPlugin', (compilation: any) => {
              const modules = Array.from(compilation.modules);
              // 모듈 분석 기능 비활성화
            });
          }
        };

        config.plugins.push(ModuleAnalyzerPlugin);
      }
    }
    return config;
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'jyzusgfmajdarftoxmbk.supabase.co',
      },
    ],
  },
};

// Sentry 설정 (개발 환경에서는 소스맵 비활성화)
const sentryOptions = {
  org: 'pickdam',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: isProd,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelCronMonitors: isProd,
  telemetry: false, // 불필요한 텔레메트리 데이터 전송 비활성화
  // 개발 환경에서는 소스맵 생성 완전 비활성화
  sourcemaps: {
    disable: isDev,
    deleteSourcemapsAfterUpload: isProd,
  },
};

// 번들 분석기 설정
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// 개발 환경에서는 Sentry 설정 완전 비활성화
export default isDev
  ? bundleAnalyzer(nextConfig)
  : bundleAnalyzer(withSentryConfig(nextConfig, sentryOptions));
