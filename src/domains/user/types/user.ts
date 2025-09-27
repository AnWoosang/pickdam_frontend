// 사용자 기본 타입 정의
import {Role} from '@/domains/auth/types/auth';

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
  role?: Role;
}

// 호환성을 위한 별칭
export interface UserProfile extends User {
  nicknameUpdatedAt?: string;
  profileImage?: string;
}

// 사용자 관련 폼 데이터 타입
export interface UpdateProfileForm {
  nickname?: string;
  profileImageUrl?: string;
}

export interface WithdrawMemberForm {
  reason?: string;
}

// 회원탈퇴 사유 옵션
export const WITHDRAW_REASONS = {
  serviceUnsatisfied: '서비스에 대한 불만',
  lackOfUse: '사용 빈도 낮음',
  privacyConcerns: '개인정보 보호 우려',
  betterAlternatives: '더 나은 대안 발견',
  userRequest: '사용자 요청',
  other: '기타'
} as const;

export const WITHDRAW_REASON_LABELS: Record<keyof typeof WITHDRAW_REASONS, string> = {
  serviceUnsatisfied: '서비스에 대한 불만',
  lackOfUse: '사용 빈도 낮음',
  privacyConcerns: '개인정보 보호 우려',
  betterAlternatives: '더 나은 대안 발견',
  userRequest: '사용자 요청',
  other: '기타'
};

// 위시리스트 토글 정보 도메인 타입
export interface WishlistLikeInfo {
  isWishlisted: boolean;
  wishlistCount: number;
}
