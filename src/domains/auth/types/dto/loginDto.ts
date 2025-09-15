// Login API 응답 관련 DTO 타입 정의

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  nickname: string;
  birth_date: string;
  gender: string;
  provider: string;
  role: string;
  is_email_verified: boolean;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
}

export interface LoginApiResponseDto {
  user: UserResponseDto;
  session: SessionResponseDto;
}