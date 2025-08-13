// 회원가입 관련 타입 정의

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  birthDate?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
}

export interface SignupResponse {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
  token?: string;
  message: string;
}

export interface SignupError {
  field?: string;
  message: string;
  code?: string;
}

export interface PasswordStrength {
  strength: number;
  text: string;
  color: string;
  requirements: string[];
  score: number;
}

export interface TermsContent {
  id: string;
  title: string;
  content: string;
  required: boolean;
  lastUpdated: string;
}

export interface SignupStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

// 회원가입 상태
export type SignupStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

// 소셜 로그인 프로바이더
export type SocialProvider = 'kakao' | 'naver' | 'google';

// 이메일 인증 상태
export type EmailVerificationStatus = 'pending' | 'sent' | 'verified' | 'expired';

export interface EmailVerification {
  email: string;
  status: EmailVerificationStatus;
  expiresAt?: string;
  attempts: number;
}