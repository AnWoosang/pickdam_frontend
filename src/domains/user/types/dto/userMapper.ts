import { User, Gender } from '@/domains/user/types/user';
import { toProvider, toRole } from '@/domains/auth/types/dto/authMapper';
import { 
  UserResponseDto, 
  WishlistItemResponseDto
} from './userResponseDto';

// WishlistItem 타입 정의 (별도 파일로 분리되지 않은 경우)
export interface WishlistItem {
  id: string;
  memberId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}


// Gender 매핑 객체
const GENDER_MAPPING = {
  'MALE': Gender.MALE,
  'FEMALE': Gender.FEMALE
} as const;

/**
 * 백엔드 gender string을 Gender enum으로 변환
 */
export function toGender(genderString: string): Gender {
  return GENDER_MAPPING[genderString as keyof typeof GENDER_MAPPING] || Gender.MALE;
}

// UserResponseDto를 User 도메인 타입으로 변환
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


// WishlistItemResponseDto를 WishlistItem 도메인 타입으로 변환
export function toWishlistItem(dto: WishlistItemResponseDto): WishlistItem {
  return {
    id: dto.id,
    memberId: dto.member_id,
    productId: dto.product_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at
  };
}

// toNicknameCheckResult, toEmailCheckResult 매퍼 제거 - API 응답을 직접 반환

