import { Gender } from '@/domains/user/types/user';

// 회원가입 도메인 타입 정의
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