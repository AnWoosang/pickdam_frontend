// 공통 상수 정의

// 성별 상수
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

export type Gender = typeof GENDER[keyof typeof GENDER];

// 로그인 제공자 상수
export const LOGIN_PROVIDER = {
  EMAIL: 'email',
  KAKAO: 'kakao',
  NAVER: 'naver',
  GOOGLE: 'google',
} as const;

export type LoginProvider = typeof LOGIN_PROVIDER[keyof typeof LOGIN_PROVIDER];

// 성별 라벨 맵핑
export const GENDER_LABELS: Record<Gender, string> = {
  [GENDER.MALE]: '남성',
  [GENDER.FEMALE]: '여성',
};

// 로그인 제공자 라벨 맵핑
export const LOGIN_PROVIDER_LABELS: Record<LoginProvider, string> = {
  [LOGIN_PROVIDER.EMAIL]: '이메일',
  [LOGIN_PROVIDER.KAKAO]: '카카오',
  [LOGIN_PROVIDER.NAVER]: '네이버',
  [LOGIN_PROVIDER.GOOGLE]: '구글',
};