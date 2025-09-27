// 사용자 API DTO 타입 정의

// =============================================
// REQUEST DTOs
// =============================================

export interface UpdateProfileRequestDto {
  nickname?: string;
  profileImageUrl?: string;
}

export interface WithdrawMemberRequestDto {
  reason?: string;
}

export type ToggleWishlistRequestDto = Record<string, never>;

export interface RemoveMultipleWishlistRequestDto {
  productIds: string[];
}

// =============================================
// RESPONSE DTOs
// =============================================

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  nickname: string;
  profileImageUrl?: string;
  role: string;
}

export interface WishlistItemResponseDto {
  id: string;
  memberId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}