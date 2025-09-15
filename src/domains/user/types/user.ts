// 사용자 기본 타입 정의
import {LoginProvider,Role} from '@/domains/auth/types/auth';

// User 관련 enum 타입들 (DTO에서 사용)
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

// Gender 한글 라벨 맵핑
export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: '남성',
  [Gender.FEMALE]: '여성'
};

// 사용자 기본 정보 (도메인 타입)
export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  profileImageUrl?: string;
  birthDate: string;
  gender: Gender;
  provider: LoginProvider;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

// 호환성을 위한 별칭
export interface UserProfile extends User {
  nicknameUpdatedAt?: string;
  profileImage?: string; // profileImageUrl과 호환성 유지
}

// 사용자 관련 폼 데이터 타입
export interface UpdateProfileData {
  name?: string;
  nickname?: string;
  profileImageUrl?: string;
  birthDate?: string;
  gender?: Gender;
}
