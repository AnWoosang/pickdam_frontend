// 회원가입 API 통합

import { apiClient } from '@/shared/api/axiosClient';
import { API_ROUTES } from '@/app/router/apiRoutes';
import { SignupRequestDto } from '@/domains/auth/types/dto/authDto';
import { SignupForm } from '@/domains/auth/types/auth';
import { LoginProvider, Role } from '@/domains/auth/types/auth';

// 회원가입 API
export const signupApi = {
  // 회원가입 요청
  async register(form: SignupForm): Promise<void> {
    const requestDto: SignupRequestDto = {
      email: form.email.toLowerCase().trim(),
      password: form.password,
      name: form.name.trim(),
      nickname: form.nickname.trim(),
      birthDate: form.birthDate,
      gender: form.gender,
      provider: LoginProvider.EMAIL,
      role: Role.USER,
    };
    await apiClient.post(API_ROUTES.AUTH.SIGNUP, requestDto);
  },
};