// 회원가입 API 통합

import { SignupForm } from '@/domains/auth/types/signup';
import { apiClient } from '@/shared/api/axiosClient';
import { API_ROUTES } from '@/app/router/apiRoutes';
import { fromSignupForm } from '@/domains/auth/types/dto/authMapper';

// 회원가입 API
export const signupApi = {
  // 회원가입 요청
  register: async (requestDto: SignupForm): Promise<void> => {
    const mappedRequestDto = fromSignupForm(requestDto);
    await apiClient.post(API_ROUTES.AUTH.SIGNUP, mappedRequestDto);
  },
};