// PaginatedResponse<T> 직접 사용

// User API Response DTOs
export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  nickname: string;
  profile_image_url?: string;
  birth_date: string;
  gender: string;
  provider: string;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
  role: string;
}


export interface WishlistItemResponseDto {
  id: string;
  member_id: string;
  product_id: string;
  created_at: string;
  updated_at: string;
}

// 단순 래핑 DTO 제거 - 직접 타입 사용
// CheckNicknameResponseDto -> boolean
// CheckEmailResponseDto -> { isAvailable: boolean; message: string }
// UpdateProfileResponseDto -> UserResponseDto
// AddToWishlistResponseDto -> WishlistItemResponseDto
// DeleteAccountResponseDto -> { success: boolean; message: string }