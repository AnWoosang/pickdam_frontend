// Auth 도메인 관련 DTO 매핑 함수들

import { LoginProvider, Role, LOGIN_PROVIDER_LABELS, USER_ROLE_LABELS, ResendEmailForm } from '../auth';
import { User } from '@/domains/user/types/user';
import { SignupForm } from '../signup';
import { toGender } from '@/domains/user/types/dto/userMapper';
import { UserResponseDto } from './loginDto';
import { SignupRequestDto, ResendEmailRequestDto } from './signupDto';

/**
 * 백엔드 provider string을 LoginProvider enum으로 변환
 */
export function toProvider(providerString: string): LoginProvider {
  const provider = Object.entries(LOGIN_PROVIDER_LABELS)
    .find(([_, label]) => label === providerString)?.[0] as LoginProvider;
  
  return provider || LoginProvider.EMAIL;
}

/**
 * 백엔드 role string을 Role enum으로 변환
 */
export function toRole(roleString: string): Role {
  const role = Object.entries(USER_ROLE_LABELS)
    .find(([_, label]) => label === roleString)?.[0] as Role;
  
  return role || Role.USER;
}

/**
 * Auth API 전용 UserResponseDto를 User 도메인 타입으로 변환
 */
export function toUser(dto: UserResponseDto): User {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    nickname: dto.nickname,
    profileImageUrl: dto.profile_image_url,
    birthDate: dto.birth_date,
    gender: toGender(dto.gender),
    provider: toProvider(dto.provider),
    isEmailVerified: dto.is_email_verified,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    role: toRole(dto.role)
  };
}

/**
 * 회원가입 폼 데이터를 API 요청 DTO로 변환
 */
export function fromSignupForm(formData: SignupForm): SignupRequestDto {
  return {
    email: formData.email.toLowerCase().trim(),
    password: formData.password,
    name: formData.name.trim(),
    nickname: formData.nickname.trim(),
    birthDate: formData.birthDate,
    gender: formData.gender,
    provider: LoginProvider.EMAIL,
    role: Role.USER,
  };
}

/**
 * 이메일 재발송 폼 데이터를 API 요청 DTO로 변환
 */
export function fromResendEmailForm(form: ResendEmailForm): ResendEmailRequestDto {
  return {
    email: form.email.toLowerCase().trim(),
    type: form.type || 'signup'
  };
}