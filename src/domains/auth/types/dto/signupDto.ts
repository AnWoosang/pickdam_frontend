// Signup API 관련 DTO 타입 정의

import { Gender } from '@/domains/user/types/user';
import { LoginProvider, Role } from '../auth';

// API 요청용 DTO
export interface SignupRequestDto {
  email: string;
  password: string;
  name: string;
  nickname: string;
  birthDate: string;
  gender: Gender;
  provider: LoginProvider;
  role: Role;
}

// API 응답용 DTO (필요시 확장)
export interface SignupResponseDto {
  message: string;
  emailSent: boolean;
}

// 이메일 재발송 API 요청 DTO
export interface ResendEmailRequestDto {
  email: string;
  type: 'signup' | 'reset';
}