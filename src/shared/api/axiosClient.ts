import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { BusinessError, createBusinessError } from '@/shared/error/BusinessError'
import { ApiErrorCode, API_ERROR_MESSAGES } from '@/shared/error/errorCodes'
import { useUIStore } from '@/domains/auth/store/authStore'
import { isProtectedRoute } from '@/app/router/auth-config'
import { queryClient } from '@/app/providers/QueryProvider'
import { authKeys } from '@/domains/auth/constants/authQueryKeys'
import toast from 'react-hot-toast'

// Axios 인스턴스 생성 - 상대 경로 사용으로 CORS 문제 해결
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : '/api';

if (typeof window !== 'undefined') {
  console.log('Window location:', window.location.href);
}

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 에러 처리 헬퍼 함수들
const handleUnauthorizedError = async (errorData: any): Promise<BusinessError> => {
  // 보호된 라우트에서만 로그인 모달 표시
  if (typeof window !== 'undefined' && isProtectedRoute(window.location.pathname)) {
    useUIStore.getState().openLoginModal();
    toast.error('로그인이 필요한 서비스입니다.');
  }

  // React Query 캐시에서 사용자 정보 제거
  queryClient.setQueryData(authKeys.user(), null);

  throw createBusinessError.fromMappedError(errorData);
};

const handleTokenRefresh = async (originalError: AxiosError): Promise<any> => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';

  if (rememberMe) {
    try {
      // 백엔드 API를 통해 토큰 갱신
      const refreshResponse = await axiosClient.post('/auth/refresh');

      if (refreshResponse.status === 200) {
        // React Query 캐시 업데이트
        const sessionInfo = refreshResponse.data;
        if (sessionInfo?.user) {
          queryClient.setQueryData(authKeys.user(), sessionInfo.user);
        }

        const originalRequest = originalError.config;
        if (originalRequest) {
          return axiosClient.request(originalRequest);
        } else {
          throw new Error('원래 요청 정보를 찾을 수 없음');
        }
      } else {
        throw new Error('토큰 갱신 실패');
      }
    } catch (refreshError) {
      // 토큰 갱신 실패 → handleUnauthorizedError 호출
      console.log('❌ [axiosClient] 토큰 갱신 실패, 권한 없음 처리');
      const errorData = (originalError.response?.data as any)?.error;
      return await handleUnauthorizedError(errorData);
    }
  } else {
    // Remember Me가 없으면 바로 handleUnauthorizedError 호출
    console.log('🔒 [axiosClient] Remember Me 비활성화, 권한 없음 처리');
    const errorData = (originalError.response?.data as any)?.error;
    return await handleUnauthorizedError(errorData);
  }
};

const handleApiError = async (error: AxiosError): Promise<BusinessError> => {
  if (error.response?.data && !(error.response.data as any).success && (error.response.data as any).error) {
    const errorData = (error.response.data as any).error;

    // 401, 403 토큰 재발급 먼저 시도
    if (errorData.statusCode === 401 || errorData.statusCode === 403) {
      return await handleTokenRefresh(error);
    }
    else {
      // 다른 에러들은 기존처럼 처리
      return createBusinessError.fromMappedError(errorData);
    }
  } else {
    let statusCode: number;

    if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
      // 서버 연결/응답 문제
      statusCode = 500;
    } else if (error.code === 'ENOTFOUND') {
      // DNS/인프라 문제
      statusCode = 503;
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      // 네트워크 연결 문제
      statusCode = 0;
    } else {
      statusCode = error.response?.status || 500;
    }

    return new BusinessError(
      error.code || 'UNKNOWN_ERROR',
      error.message || '알 수 없는 오류가 발생했습니다.',
      statusCode,
      `원본 에러 정보: ${JSON.stringify({ name: error.name })}`
    );
  }
};

// 요청 인터셉터
axiosClient.interceptors.request.use(
  (config) => {
    // 요청 전 처리
    console.log(`🚀 [axiosClient] API Request: ${config.method?.toUpperCase()} ${config.url}`)

    // 요청 데이터 로그 추가
    if (config.data) {
      console.log('📝 [axiosClient] Request Data:', config.data);
    }
    
    // 쿠키 기반 인증을 사용하므로 withCredentials 설정
    config.withCredentials = true

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)


// 응답 인터셉터
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 데이터 로깅
    console.log(`🔔 [axiosClient] API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`)
    console.log('🔔 [axiosClient] Status:', response.status)
    console.log('🔔 [axiosClient] Data:', response.data)
    return response
  },
  async (error: AxiosError) => {
    const result = await handleApiError(error);

    if (process.env.NODE_ENV === 'development') {
      console.warn('🔄 [axiosClient] API Error:', error);
    }

    throw result;
  }
)


// API 클라이언트 래퍼 클래스
export class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axiosClient
  }

  // GET 요청
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  // POST 요청
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  // PUT 요청
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  // DELETE 요청
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  // PATCH 요청
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient()
export default axiosClient