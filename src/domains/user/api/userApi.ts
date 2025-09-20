import { apiClient } from '@/shared/api/axiosClient'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { ApiResponse } from '@/shared/api/types'

// Domain types
import {
  User,
  UpdateProfileForm,
  WithdrawMemberForm
} from '@/domains/user/types/user'

// DTO types
import {
  UpdateProfileRequestDto,
  WithdrawMemberRequestDto,
  UserResponseDto
} from '@/domains/user/types/dto/userDto';
import {
  toUser
} from '@/domains/user/types/dto/userMapper';

export const userApi = {
  // 닉네임 중복확인
  async checkNicknameDuplicate(nickname: string): Promise<{ isDuplicate: boolean }> {
    
    const response = await apiClient.get<ApiResponse<{ isDuplicate: boolean }>>(
      `${API_ROUTES.USERS.CHECK_NICKNAME}?nickname=${nickname}`);

    return response.data!;
  },

  // 이메일 중복확인
  async checkEmailDuplicate(email: string): Promise<{ isAvailable: boolean }> {
    
    const response = await apiClient.post<ApiResponse<{ isAvailable: boolean }>>(
      API_ROUTES.USERS.CHECK_EMAIL, 
      { email }
    );
    
    return response.data!;
  },

  // 사용자 프로필 업데이트
  async updateProfile(userId: string, requestDto: UpdateProfileForm): Promise<User> {

    const mappedRequestDto: UpdateProfileRequestDto = {
      nickname: requestDto.nickname,
      profileImageUrl: requestDto.profileImageUrl
    };

    const response = await apiClient.patch<ApiResponse<{ user: UserResponseDto }>>(
      API_ROUTES.USERS.BY_ID(userId),
      mappedRequestDto
    );

    return toUser(response.data!.user);
  },


  // 회원탈퇴 (Soft Delete 방식)
  async withdrawMember(memberId: string, requestForm: WithdrawMemberForm): Promise<void> {
    const mappedRequestDto: WithdrawMemberRequestDto = {
      reason: requestForm.reason
    };

    await apiClient.delete<ApiResponse<void>>(
      API_ROUTES.USERS.BY_ID(memberId),
      { data: mappedRequestDto }
    );
  }
}