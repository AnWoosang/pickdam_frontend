import { withSentryConfig } from '@sentry/nextjs';
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
              const moduleInfo = modules.map((module: any) => ({
                name: module.rawRequest || module.request || 'unknown',
                size: module.size ? module.size() : 0,
                type: module.constructor.name,
                reasons: module.reasons?.map((r: any) => r.module?.rawRequest || r.module?.request || 'unknown') || []
              }));

              console.log('📊 MODULE ANALYSIS:');
              console.log(`Total modules: ${modules.length}`);

              // 크기별 상위 20개 모듈
              const topModules = moduleInfo
                .filter(m => m.size > 0)
                .sort((a, b) => b.size - a.size)
                .slice(0, 20);

              console.log('\n🔍 TOP 20 LARGEST MODULES:');
              topModules.forEach((mod, i) => {
                console.log(`${i + 1}. ${mod.name} (${mod.size} bytes) - ${mod.type}`);
              });

              // node_modules 분석
              const nodeModules = moduleInfo.filter(m => m.name.includes('node_modules'));
              console.log(`\n📦 Node modules: ${nodeModules.length}`);

              const topNodeModules = nodeModules
                .sort((a, b) => b.size - a.size)
                .slice(0, 10);

              console.log('\n🔍 TOP 10 NODE MODULES:');
              topNodeModules.forEach((mod, i) => {
                const packageName = mod.name.match(/node_modules\/([^\/]+)/)?.[1] || mod.name;
                console.log(`${i + 1}. ${packageName} (${mod.size} bytes)`);
              });
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
  widenClientFileUpload: process.env.NODE_ENV === 'production',
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelCronMonitors: process.env.NODE_ENV === 'production',
  // 개발 환경에서는 소스맵 생성 완전 비활성화
  sourcemaps: {
    disable: process.env.NODE_ENV === 'development',
    deleteSourcemapsAfterUpload: process.env.NODE_ENV === 'production',
  },
};

// 번들 분석기 설정
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// 개발 환경에서는 기본 설정만, 프로덕션에서는 Sentry 포함
const configWithSentry = process.env.NODE_ENV === 'development'
  ? nextConfig
  : withSentryConfig(nextConfig, sentryOptions);

export default bundleAnalyzer(configWithSentry);
