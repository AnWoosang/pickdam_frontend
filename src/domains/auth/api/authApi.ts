import { LoginFormData, SessionInfo, EmailVerificationParams, ResendEmailForm } from '@/domains/auth/types/auth';
import { User } from '@/domains/user/types/user';
import { LoginApiResponseDto, UserResponseDto } from '@/domains/auth/types/dto/loginDto';
import { apiClient } from '@/shared/api/axiosClient';
import { toUser, fromResendEmailForm } from '@/domains/auth/types/dto/authMapper';
import { toSession } from '@/domains/auth/types/dto/sessionMapper';
import { ApiResponse } from '@/shared/api/types';
import { API_ROUTES } from '@/app/router/apiRoutes';


export const authApi = {
  // 로그인 API 
  async loginWithEmail(requestDto: LoginFormData): Promise<SessionInfo> {
    const response: ApiResponse<LoginApiResponseDto> = await apiClient.post(API_ROUTES.AUTH.LOGIN, {
      email: requestDto.email,
      password: requestDto.password,
    });

    return {
      user: toUser(response.data!.user),
      session: toSession(response.data!.session)
    };
  },

  // 로그아웃 API
  async logout(): Promise<void> {
    await apiClient.post(API_ROUTES.AUTH.LOGOUT);
  },

  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<User> {
    const response: ApiResponse<{ user: UserResponseDto }> = await apiClient.get(API_ROUTES.AUTH.ME);
    return toUser(response.data!.user);
  },

  // 세션 새로고침
  async refreshSession(): Promise<SessionInfo> {
    const response: ApiResponse<LoginApiResponseDto> = await apiClient.post('/auth/session/refresh');
    
    return {
      user: toUser(response.data!.user),
      session: toSession(response.data!.session)
    };
  },

  // 이메일 인증
  async verifyEmail(requestDto: EmailVerificationParams): Promise<void> {
    await apiClient.post(API_ROUTES.AUTH.VERIFY_EMAIL, requestDto);
  },

  // 인증 메일 재발송
  async resendEmail(requestDto: ResendEmailForm): Promise<void> {
    const mappedRequestDto = fromResendEmailForm(requestDto);
    await apiClient.post(API_ROUTES.AUTH.RESEND_EMAIL, mappedRequestDto);
  },
};

