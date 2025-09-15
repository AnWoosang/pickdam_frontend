import { Gender } from '@/domains/user/types/user';

// User API Request DTOs
export interface CheckNicknameRequestDto {
  nickname: string;
}

export interface CheckEmailRequestDto {
  email: string;
}

export interface UpdateProfileRequestDto {
  name?: string;
  nickname?: string;
  profileImageUrl?: string;
  birthDate?: string;
  gender?: Gender;
}

export interface DeleteAccountRequestDto {
  reason?: string;
}

