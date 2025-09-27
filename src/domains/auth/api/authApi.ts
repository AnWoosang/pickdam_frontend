import { LoginForm, SessionInfo, EmailVerificationParams, ResendEmailForm, FindPasswordForm, ResetPasswordForm } from '@/domains/auth/types/auth';
import { User } from '@/domains/user/types/user';
import { LoginRequestDto, UserSessionResponseDto, ResendEmailRequestDto } from '@/domains/auth/types/dto/authDto';
import { UserResponseDto } from '@/domains/user/types/dto/userDto';
import { apiClient } from '@/shared/api/axiosClient';
import { toUser } from '@/domains/user/types/dto/userMapper';
import { toSession } from '@/domains/auth/types/dto/authMapper';
import { ApiResponse } from '@/shared/api/types';
import { API_ROUTES } from '@/app/router/apiRoutes';


export const authApi = {
  // 로그인 API
  async loginWithEmail(loginForm: LoginForm): Promise<SessionInfo> {
    const requestDto: LoginRequestDto = {
      email: loginForm.email,
      password: loginForm.password
    };

    const response: ApiResponse<UserSessionResponseDto> = await apiClient.post(API_ROUTES.AUTH.LOGIN, requestDto);

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
    const response: ApiResponse<{ user: UserResponseDto }> = await apiClient.get(API_ROUTES.AUTH.ME);
    return toUser(response.data!.user);
  },

  // 세션 새로고침
  async refreshSession(): Promise<SessionInfo> {
    const response: ApiResponse<UserSessionResponseDto> = await apiClient.post(API_ROUTES.AUTH.REFRESH);

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

  // 비밀번호 찾기 (재설정 이메일 발송)
  async findPassword(form: FindPasswordForm): Promise<void> {
    await apiClient.post(API_ROUTES.AUTH.FIND_PASSWORD, {
      email: form.email.toLowerCase().trim()
    });
  },

  // 비밀번호 재설정 (실제 비밀번호 변경)
  async resetPassword(form: ResetPasswordForm): Promise<void> {
    await apiClient.post(API_ROUTES.AUTH.RESET_PASSWORD, {
      password: form.password.trim()
    });
  },
};