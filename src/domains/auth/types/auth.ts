import { User, Gender } from '@/domains/user/types/user';

// ========== ENUMS ==========

export enum LoginProvider {
  EMAIL = 'EMAIL',
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
  GOOGLE = 'GOOGLE',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
}

// ========== CONSTANTS ==========

export const LOGIN_PROVIDER_LABELS: Record<LoginProvider, string> = {
  [LoginProvider.EMAIL]: 'EMAIL',
  [LoginProvider.KAKAO]: 'KAKAO',
  [LoginProvider.APPLE]: 'APPLE',
  [LoginProvider.GOOGLE]: 'GOOGLE',
};

export const USER_ROLE_LABELS: Record<Role, string> = {
  [Role.USER]: '일반 사용자',
  [Role.ADMIN]: '관리자',
  [Role.SELLER]: '판매자',
};

// ========== SESSION TYPES ==========

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt?: number;
  tokenType: string;
}

export interface SessionInfo {
  user: User;
  session: Session;
}

// ========== AUTH FORM TYPES ==========

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  birthDate: string;
  gender: Gender;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted?: boolean;
}

// 이메일 재발송 폼 타입
export interface ResendEmailForm {
  email: string;
  type?: 'signup' | 'email_change';
}

// 비밀번호 찾기 폼 타입
export interface FindPasswordForm {
  email: string;
}

// 비밀번호 재설정 폼 타입
export interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

// ========== EMAIL VERIFICATION TYPES ==========

export interface EmailVerificationParams {
  tokenHash?: string 
  token?: string
  accessToken?: string
  refreshToken?: string
  type?: string
}