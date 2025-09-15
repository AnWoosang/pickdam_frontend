import { User } from '@/domains/user/types/user';

// Gender enum과 GENDER_LABELS를 여기에서 재export
export { Gender, GENDER_LABELS } from '@/domains/user/types/user';

// 로그인 관련 타입 정의
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SessionInfo {
  user: User;
  session: Session;
}

// Auth 상태 관리 타입 정의
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 세션 타입 정의
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
}

// 이메일 인증 처리 타입
export interface EmailVerificationParams {
  token_hash?: string
  token?: string
  access_token?: string
  refresh_token?: string
  type?: string
}

// 로그인 제공자 enum
export enum LoginProvider {
  EMAIL = 'EMAIL',
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
  GOOGLE = 'GOOGLE',
}

// 로그인 제공자 라벨 맵핑
export const LOGIN_PROVIDER_LABELS: Record<LoginProvider, string> = {
  [LoginProvider.EMAIL]: 'EMAIL',
  [LoginProvider.KAKAO]: 'KAKAO',
  [LoginProvider.APPLE]: 'APPLE',
  [LoginProvider.GOOGLE]: 'GOOGLE',
};

// 사용자 역할 enum
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN', 
  SELLER = 'SELLER',
}

// 사용자 역할 라벨 맵핑
export const USER_ROLE_LABELS: Record<Role, string> = {
  [Role.USER]: 'USER',
  [Role.ADMIN]: 'ADMIN',
  [Role.SELLER]: 'SELLER',
};

// 비밀번호 관련 타입 정의
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// 이메일 재발송 폼 타입
export interface ResendEmailForm {
  email: string;
  type?: 'signup' | 'reset';
}