import { ROUTES } from '@/app/router/routes';

/**
 * 광고 표시 설정
 * 라우트별로 배너 광고와 사이드 광고 표시 여부를 관리
 */
export interface AdConfig {
  showBannerAds: boolean;
  showSideAd: boolean;
}

/**
 * ROUTES 객체로부터 모든 정적 라우트 경로 추출
 */
const extractRoutes = (obj: any): string[] => {
  const routes: string[] = [];

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'string') {
      routes.push(value);
    } else if (typeof value === 'object' && value !== null) {
      routes.push(...extractRoutes(value));
    }
  }

  return routes;
};

const staticRoutes = extractRoutes(ROUTES);

/**
 * 라우트별 광고 설정 동적 생성
 * ROUTES에 정의된 모든 경로에 대해 기본값(모든 광고 표시) 설정
 */
export const AD_CONFIG: Record<string, AdConfig> = staticRoutes.reduce((acc, route) => {
  acc[route] = { showBannerAds: true, showSideAd: true };
  return acc;
}, {} as Record<string, AdConfig>);

AD_CONFIG[ROUTES.AUTH.SIGNUP_COMPLETE] = { showBannerAds: false, showSideAd: true }; // 배너 광고만 끄기
AD_CONFIG[ROUTES.MYPAGE.HOME] = { showBannerAds: true, showSideAd: false }; // 사이드 광고만 끄기
AD_CONFIG[ROUTES.HOME] = { showBannerAds: true, showSideAd: false };

/**
 * 기본 광고 설정 (라우트별 설정이 없을 때 사용)
 */
export const DEFAULT_AD_CONFIG: AdConfig = {
  showBannerAds: true,
  showSideAd: true,
};

/**
 * 현재 경로에 대한 광고 설정 가져오기
 */
export const getAdConfig = (pathname: string): AdConfig => {
  // 동적 라우트 처리 (/product/[id], /community/[id] 등)
  if (pathname.startsWith('/product/')) {
    return AD_CONFIG[ROUTES.PRODUCT.LIST] || DEFAULT_AD_CONFIG;
  }

  if (pathname.startsWith('/community/') && pathname !== ROUTES.COMMUNITY.LIST && pathname !== ROUTES.COMMUNITY.WRITE) {
    return AD_CONFIG[ROUTES.COMMUNITY.LIST] || DEFAULT_AD_CONFIG;
  }

  // 설정된 경로면 해당 설정 반환, 아니면 기본값 반환
  return AD_CONFIG[pathname] || DEFAULT_AD_CONFIG;
};