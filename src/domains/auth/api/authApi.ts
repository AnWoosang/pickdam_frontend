import { LoginForm, SessionInfo, EmailVerificationParams, ResendEmailForm } from '@/domains/auth/types/auth';
import { User } from '@/domains/user/types/user';
import { LoginApiResponseDto, ResendEmailRequestDto } from '@/domains/auth/types/dto/authDto';
import { UserResponseDto } from '@/domains/user/types/dto/userDto';
import { apiClient } from '@/shared/api/axiosClient';
import { toUser } from '@/domains/user/types/dto/userMapper';
import { toSession } from '@/domains/auth/types/dto/authMapper';
import { ApiResponse } from '@/shared/api/types';
import { API_ROUTES } from '@/app/router/apiRoutes';
import { isProtectedRoute } from '@/app/router/auth-config';
import { BusinessError } from '@/shared/error/BusinessError';


export const authApi = {
  // 로그인 API 
  async loginWithEmail(requestDto: LoginForm): Promise<SessionInfo> {
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
  async getCurrentUser(): Promise<User | null> {
    try {
      const response: ApiResponse<{ user: UserResponseDto }> = await apiClient.get(API_ROUTES.AUTH.ME);
      return toUser(response.data!.user);
    } catch (error) {
      // BusinessError만 처리 (인증 관련 에러)
      if (error instanceof BusinessError) {
        if (typeof window !== 'undefined' && !isProtectedRoute(window.location.pathname)) {
          console.log("공개 라우트에서 인증 에러, null 반환:", window.location.pathname);
          return null;
        }
      }
      throw error;
    }
  },

  // 세션 새로고침
  async refreshSession(): Promise<SessionInfo> {
    const response: ApiResponse<LoginApiResponseDto> = await apiClient.post(API_ROUTES.AUTH.REFRESH);

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
  async resendEmail(form: ResendEmailForm): Promise<void> {
    const requestDto: ResendEmailRequestDto = {
      email: form.email.toLowerCase().trim(),
      type: form.type || 'signup'
    };
    await apiClient.post(API_ROUTES.AUTH.RESEND_EMAIL, requestDto);
  },
};

