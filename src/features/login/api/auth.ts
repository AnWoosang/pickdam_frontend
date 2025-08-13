import { 
  User, 
  LoginFormData, 
  LoginResponse, 
  SignupFormData, 
  SignupResponse, 
  SocialLoginResponse, 
  SocialProvider,
  PasswordResetRequest,
  PasswordResetConfirm,
  ProfileUpdateData,
  PasswordChangeData
} from '@/types/auth';

// Base API URL (환경변수로 관리)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API 요청 헬퍼 함수
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // 토큰이 있으면 Authorization 헤더 추가
  const token = localStorage.getItem('accessToken');
  if (token) {
    (defaultOptions.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      message: '네트워크 오류가 발생했습니다.' 
    }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// 로그인 API
export const loginWithEmail = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // 토큰 저장
  if (response.accessToken) {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  return response;
};

// 소셜 로그인 API
export const loginWithSocial = async (
  provider: SocialProvider, 
  code: string
): Promise<SocialLoginResponse> => {
  const response = await apiRequest<SocialLoginResponse>('/auth/social/login', {
    method: 'POST',
    body: JSON.stringify({ provider, code }),
  });

  // 토큰 저장
  if (response.accessToken) {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  return response;
};

// 회원가입 API
export const signup = async (data: SignupFormData): Promise<SignupResponse> => {
  const response = await apiRequest<SignupResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // 토큰 저장
  if (response.accessToken) {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  return response;
};

// 로그아웃 API
export const logout = async (): Promise<void> => {
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    // 로그아웃은 서버 에러가 있어도 로컬 토큰 삭제
    console.error('Logout API error:', error);
  } finally {
    // 토큰 삭제
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// 토큰 갱신 API
export const refreshToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  const refreshTokenValue = localStorage.getItem('refreshToken');
  
  if (!refreshTokenValue) {
    throw new Error('Refresh token not found');
  }

  const response = await apiRequest<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: refreshTokenValue }),
  });

  // 새 토큰 저장
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);

  return response;
};

// 현재 사용자 정보 조회 API
export const getCurrentUser = async (): Promise<User> => {
  return apiRequest<User>('/auth/me');
};

// 비밀번호 재설정 요청 API
export const requestPasswordReset = async (data: PasswordResetRequest): Promise<void> => {
  return apiRequest('/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 비밀번호 재설정 확인 API
export const confirmPasswordReset = async (data: PasswordResetConfirm): Promise<void> => {
  return apiRequest('/auth/password/reset/confirm', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 프로필 업데이트 API
export const updateProfile = async (data: ProfileUpdateData): Promise<User> => {
  return apiRequest<User>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// 비밀번호 변경 API
export const changePassword = async (data: PasswordChangeData): Promise<void> => {
  return apiRequest('/auth/password/change', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 이메일 인증 요청 API
export const requestEmailVerification = async (): Promise<void> => {
  return apiRequest('/auth/email/verify/request', {
    method: 'POST',
  });
};

// 이메일 인증 확인 API
export const confirmEmailVerification = async (token: string): Promise<void> => {
  return apiRequest('/auth/email/verify/confirm', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
};

// 계정 삭제 API
export const deleteAccount = async (): Promise<void> => {
  await apiRequest('/auth/account', {
    method: 'DELETE',
  });

  // 토큰 삭제
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// 토큰 유효성 검사
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  try {
    // JWT 토큰 디코딩 (간단한 만료시간 체크)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

// 소셜 로그인 URL 생성
export const getSocialLoginUrl = (provider: SocialProvider): string => {
  const redirectUri = `${window.location.origin}/auth/callback`;
  
  const urls = {
    kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=profile_nickname,profile_image,account_email`,
    naver: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${redirectUri}&state=${Math.random().toString(36)}`,
    google: `https://accounts.google.com/oauth2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`,
    facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email`,
  };

  return urls[provider];
};