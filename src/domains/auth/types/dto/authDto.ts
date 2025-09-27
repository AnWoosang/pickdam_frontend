// Auth API 관련 DTO 타입 정의 (통합)

import { Gender } from '@/domains/user/types/user';
import { LoginProvider, Role } from '../auth';
import { UserResponseDto } from '@/domains/user/types/dto/userDto';

// =============================================
// LOGIN DTO
// =============================================

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface VerifyEmailRequestDto {
  tokenHash?: string;
  token?: string;
  type?: 'email' | 'recovery';
}

export interface SessionResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
  tokenType: string;
}

export interface UserSessionResponseDto {
  user: UserResponseDto;
  session: SessionResponseDto;
}

// =============================================
// SIGNUP DTO
// =============================================

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
  type: 'signup' | 'email_change';
}

// 비밀번호 찾기 API 요청 DTO
export interface FindPasswordRequestDto {
  email: string;
}

