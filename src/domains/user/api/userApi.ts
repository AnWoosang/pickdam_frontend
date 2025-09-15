import { apiClient } from '@/shared/api/axiosClient'
import { API_ROUTES } from '@/app/router/apiRoutes'

// Domain types
import { 
  User, 
  UpdateProfileData 
} from '@/domains/user/types/user'

// DTO types
import {
  CheckEmailRequestDto,
  UpdateProfileRequestDto
} from '@/domains/user/types/dto/userRequestDto';
import {
  UserResponseDto
} from '@/domains/user/types/dto/userResponseDto';
import {
  toUser
} from '@/domains/user/types/dto/userMapper';

export const userApi = {
  // 닉네임 중복확인
  async checkNicknameDuplicate(nickname: string): Promise<{ isDuplicate: boolean }> {
    const response = await apiClient.get<{ isDuplicate: boolean }>(`${API_ROUTES.USERS.CHECK_NICKNAME}?nickname=${nickname}`);
    return response;
  },

  // 이메일 중복확인
  async checkEmailDuplicate(email: string): Promise<{ isAvailable: boolean }> {
    const requestDto: CheckEmailRequestDto = { email };
    const response = await apiClient.post<{ isAvailable: boolean }>(API_ROUTES.USERS.CHECK_EMAIL, requestDto);
    return response;
  },

  // 사용자 프로필 업데이트
  async updateProfile(userId: string, requestDto: UpdateProfileData): Promise<User> {
    const mappedRequestDto: UpdateProfileRequestDto = {
      name: requestDto.name,
      nickname: requestDto.nickname,
      profileImageUrl: requestDto.profileImageUrl,
      birthDate: requestDto.birthDate,
      gender: requestDto.gender
    };
    const response = await apiClient.put<UserResponseDto>(API_ROUTES.USERS.PROFILE(userId), mappedRequestDto);
    return toUser(response);
  },


  // 회원탈퇴 (Soft Delete 방식)
  async withdrawMember(memberId: string, reason?: string): Promise<void> {
    await apiClient.delete(API_ROUTES.USERS.DELETE(memberId), { data: { reason } });
  }
}