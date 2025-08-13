// 로그인 관련 타입 정의

// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  provider?: 'email' | 'kakao' | 'naver' | 'google' | 'facebook';
  createdAt: string;
  updatedAt?: string;
}

// 로그인 폼 데이터
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 로그인 응답 타입
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// 소셜 로그인 제공자 타입
export type SocialProvider = 'kakao' | 'naver' | 'google' | 'facebook';

// 소셜 로그인 응답 타입
export interface SocialLoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

// 회원가입 폼 데이터
export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted?: boolean;
}

// 회원가입 응답 타입
export interface SignupResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// 비밀번호 재설정 요청 데이터
export interface PasswordResetRequest {
  email: string;
}

// 비밀번호 재설정 확인 데이터
export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// 인증 상태 타입
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API 에러 응답 타입
export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// 토큰 정보 타입
export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// 프로필 업데이트 데이터
export interface ProfileUpdateData {
  name?: string;
  profileImage?: string;
}

// 비밀번호 변경 데이터
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}