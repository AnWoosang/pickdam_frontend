// 회원가입 API 통합

import { SignupFormData, SignupResponse, EmailVerification } from '@/types/signup';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: { [key: string]: string };
}

// API 에러 클래스
export class SignupApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: { [key: string]: string }
  ) {
    super(message);
    this.name = 'SignupApiError';
  }
}

// API 호출 헬퍼 함수
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new SignupApiError(
        data.message || '서버 오류가 발생했습니다.',
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof SignupApiError) {
      throw error;
    }
    
    throw new SignupApiError(
      '네트워크 오류가 발생했습니다.',
      0
    );
  }
};

// 회원가입 API
export const signupApi = {
  // 회원가입 요청
  register: async (formData: SignupFormData): Promise<SignupResponse> => {
    const response = await apiCall<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        name: formData.name.trim(),
        birthDate: formData.birthDate || undefined,
        termsAccepted: formData.termsAccepted,
        privacyAccepted: formData.privacyAccepted,
        marketingAccepted: formData.marketingAccepted,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.success || !response.data) {
      throw new SignupApiError(
        response.message || '회원가입에 실패했습니다.',
        400,
        response.errors
      );
    }

    return response.data;
  },

  // 이메일 중복 확인
  checkEmailAvailability: async (email: string): Promise<boolean> => {
    const response = await apiCall<{ available: boolean }>(`/auth/check-email`, {
      method: 'POST',
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    });

    if (!response.success || response.data === undefined) {
      throw new SignupApiError(
        response.message || '이메일 확인에 실패했습니다.',
        400
      );
    }

    return response.data.available;
  },

  // 이메일 인증코드 발송
  sendEmailVerification: async (email: string): Promise<void> => {
    const response = await apiCall<{ expiresAt: string }>('/auth/send-verification', {
      method: 'POST',
      body: JSON.stringify({ 
        email: email.toLowerCase().trim(),
        purpose: 'signup',
      }),
    });

    if (!response.success) {
      throw new SignupApiError(
        response.message || '인증코드 발송에 실패했습니다.',
        400
      );
    }
  },

  // 이메일 인증코드 확인
  verifyEmailCode: async (email: string, code: string): Promise<boolean> => {
    const response = await apiCall<{ verified: boolean }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ 
        email: email.toLowerCase().trim(),
        code: code.trim(),
        purpose: 'signup',
      }),
    });

    if (!response.success || response.data === undefined) {
      throw new SignupApiError(
        response.message || '인증코드가 올바르지 않습니다.',
        400
      );
    }

    return response.data.verified;
  },


  // 소셜 회원가입 (카카오)
  signupWithKakao: async (accessToken: string): Promise<SignupResponse> => {
    const response = await apiCall<SignupResponse>('/auth/signup/kakao', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });

    if (!response.success || !response.data) {
      throw new SignupApiError(
        response.message || '카카오 회원가입에 실패했습니다.',
        400
      );
    }

    return response.data;
  },

  // 소셜 회원가입 (네이버)
  signupWithNaver: async (accessToken: string): Promise<SignupResponse> => {
    const response = await apiCall<SignupResponse>('/auth/signup/naver', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });

    if (!response.success || !response.data) {
      throw new SignupApiError(
        response.message || '네이버 회원가입에 실패했습니다.',
        400
      );
    }

    return response.data;
  },
};

// Mock API (개발용)
export const mockSignupApi = {
  register: async (formData: SignupFormData): Promise<SignupResponse> => {
    // 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock 검증
    const mockExistingEmails = ['test@example.com', 'admin@pickdam.com'];
    if (mockExistingEmails.includes(formData.email.toLowerCase())) {
      throw new SignupApiError('이미 사용중인 이메일입니다.', 409);
    }

    return {
      user: {
        id: `user_${Date.now()}`,
        email: formData.email,
        name: formData.name,
        createdAt: new Date().toISOString(),
      },
      token: `mock_jwt_token_${Date.now()}`,
      message: '회원가입이 완료되었습니다.',
    };
  },

  checkEmailAvailability: async (email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockExistingEmails = ['test@example.com', 'admin@pickdam.com'];
    return !mockExistingEmails.includes(email.toLowerCase());
  },

  sendEmailVerification: async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`[Mock] 인증코드가 ${email}로 발송되었습니다. (테스트 코드: 123456)`);
  },

  verifyEmailCode: async (email: string, code: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const validCodes = ['123456', '000000'];
    return validCodes.includes(code);
  },
};

// 개발 환경에서는 Mock API 사용, 프로덕션에서는 실제 API 사용
export const currentSignupApi = process.env.NODE_ENV === 'development' ? mockSignupApi : signupApi;