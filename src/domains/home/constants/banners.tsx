import { ReactNode } from 'react';

export interface Banner {
  id: number;
  gradient: string;
  title: ReactNode;
  description: ReactNode;
}

export const PROMO_BANNERS: Banner[] = [
  {
    id: 1,
    gradient: 'from-primary to-blue-600',
    title: (
      <>
        전자담배 상품을 <br className="lg:hidden" />
        <span className="text-yellow-300">최저가</span>로 찾아드려요! 🔍
      </>
    ),
    description: (
      <>
        시중의 모든 전자담배 관련 상품을 한 번에 비교하고 <br className="hidden lg:block" />
        가장 저렴한 가격을 안내해드리는 스마트한 쇼핑 서비스에요 <br className="hidden lg:block" />
        모든 상품은 매일 최신화 해놓을게요 !
      </>
    )
  },
  {
    id: 2,
    gradient: 'from-primary to-green-600',
    title: (
      <>
        커뮤니티에서 <br className="lg:hidden" />
        <span className="text-yellow-300">소통하고 정보를 공유</span>해보세요! 💬
      </>
    ),
    description: (
      <>
        다양한 상품 후기와 팁을 공유하고 <br className="hidden lg:block" />
        같은 관심사를 가진 사람들과 소통할 수 있어요
      </>
    )
  }
];

export const PROMO_BANNER_DEFAULTS = {
  AUTO_PLAY_INTERVAL: 7000,
  HEIGHT: 260,
} as const;