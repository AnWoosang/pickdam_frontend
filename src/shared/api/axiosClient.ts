import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { BusinessError, createBusinessError } from '@/shared/error/BusinessError'
import { useUIStore } from '@/domains/auth/store/authStore'
import { isProtectedRoute } from '@/app/router/auth-config'
import { queryClient } from '@/app/providers/QueryProvider'
import { authKeys } from '@/domains/auth/constants/authQueryKeys'
import { API_ROUTES } from '@/app/router/apiRoutes'
import { apiLogger } from '@/infrastructure/logging/logger'

// Axios 인스턴스 생성 - 상대 경로 사용으로 CORS 문제 해결
const baseURL = '/api';

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 에러 처리 헬퍼 함수들
const handleUnauthorizedError = async (errorData: any): Promise<BusinessError> => {
  apiLogger.warn('인증 오류 처리 시작', {
    errorData,
    currentPath: typeof window !== 'undefined' ? window.location.pathname : 'server',
    isProtectedRoute: typeof window !== 'undefined' ? isProtectedRoute(window.location.pathname) : false
  });

  // 보호된 라우트에서만 로그인 모달 표시
  if (typeof window !== 'undefined' && isProtectedRoute(window.location.pathname)) {
    useUIStore.getState().openLoginModal();
    useUIStore.getState().showToast('로그인이 필요한 서비스입니다.', 'error');
    apiLogger.info('로그인 모달 표시');
  }

  // React Query 캐시에서 사용자 정보 제거
  queryClient.setQueryData(authKeys.user(), null);
  apiLogger.info('사용자 캐시 정보 제거');

  throw createBusinessError.fromMappedError(errorData);
};

const handleTokenRefresh = async (originalError: AxiosError): Promise<any> => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';

  apiLogger.info('토큰 갱신 시도', {
    rememberMe,
    originalUrl: originalError.config?.url,
    originalMethod: originalError.config?.method
  });

  if (rememberMe) {
    try {
      // 백엔드 API를 통해 토큰 갱신
      apiLogger.debug('토큰 갱신 API 호출');
      const refreshResponse = await axiosClient.post(API_ROUTES.AUTH.REFRESH);

      if (refreshResponse.status === 200) {
        apiLogger.success('토큰 갱신 성공');

        // React Query 캐시 업데이트
        const sessionInfo = refreshResponse.data;
        if (sessionInfo?.user) {
          queryClient.setQueryData(authKeys.user(), sessionInfo.user);
          apiLogger.debug('사용자 캐시 업데이트 완료');
        }

        const originalRequest = originalError.config;
        if (originalRequest) {
          apiLogger.info('원본 요청 재시도', {
            url: originalRequest.url,
            method: originalRequest.method
          });
          return axiosClient.request(originalRequest);
        } else {
          apiLogger.error('원본 요청 정보 없음');
          throw new Error('원래 요청 정보를 찾을 수 없음');
        }
      } else {
        apiLogger.error('토큰 갱신 응답 오류', { status: refreshResponse.status });
        throw new Error('토큰 갱신 실패');
      }
    } catch (refreshError) {
      // 토큰 갱신 실패 → handleUnauthorizedError 호출
      apiLogger.error('토큰 갱신 실패', refreshError);
      const errorData = (originalError.response?.data as any)?.error;
      return await handleUnauthorizedError(errorData);
    }
  } else {
    apiLogger.info('자동 로그인 비활성화 - 인증 오류 처리');
    const errorData = (originalError.response?.data as any)?.error;
    return await handleUnauthorizedError(errorData);
  }
};

const handleApiError = async (error: AxiosError): Promise<BusinessError | never> => {
  apiLogger.debug('API 에러 처리 시작', {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    code: error.code
  });

  if (error.response?.data && !(error.response.data as any).success && (error.response.data as any).error) {
    const errorData = (error.response.data as any).error;

    // 401, 403 토큰 재발급 먼저 시도
    if (errorData.statusCode === 401 || errorData.statusCode === 403) {
      apiLogger.warn('인증/권한 오류 - 토큰 갱신 시도', {
        statusCode: errorData.statusCode,
        url: error.config?.url
      });
      return await handleTokenRefresh(error);
    }

    else {
      // 다른 에러들은 기존처럼 처리
      apiLogger.error('비즈니스 에러 발생', errorData);
      throw createBusinessError.fromMappedError(errorData);
    }
  } else {
    let statusCode: number;
    let userMessage: string;

    if (error.code === 'ERR_NETWORK' || !error.response) {
      // 네트워크 연결 문제
      statusCode = 0;
      userMessage = '인터넷 연결을 확인하고 다시 시도해주세요.';
      apiLogger.error('네트워크 연결 오류', { code: error.code });
    } else {
      // 모든 서버/시스템 에러는 일시적인 문제로 처리
      if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
        statusCode = 500;
      } else if (error.code === 'ENOTFOUND') {
        statusCode = 503;
      } else {
        statusCode = error.response?.status || 500;
      }
      userMessage = '일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      apiLogger.error('서버/시스템 오류', {
        code: error.code,
        status: statusCode,
        message: error.message
      });
    }

    // 모든 네트워크/시스템 에러는 토스트로만 처리
    useUIStore.getState().showToast(userMessage, 'error');
    throw new BusinessError(
      error.code || 'UNKNOWN_ERROR',
      userMessage,
      statusCode,
      `원본 에러 정보: ${JSON.stringify({ name: error.name })}`
    );
  }
};

// 요청 인터셉터
axiosClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true

    // API 요청 로깅
    apiLogger.info('API 요청 시작', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      params: config.params,
      data: config.data,
      timeout: config.timeout
    });

    return config
  },
  (error) => {
    apiLogger.error('API 요청 설정 오류', error);
    return Promise.reject(error)
  }
)

// 응답 인터셉터
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // API 응답 성공 로깅
    apiLogger.success('API 응답 성공', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      responseTime: response.headers?.['x-response-time'] || 'N/A'
    });

    return response
  },
  async (error: AxiosError) => {
    // API 응답 오류 로깅
    apiLogger.error('API 응답 오류', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      errorCode: error.code,
      errorMessage: error.message,
      responseData: error.response?.data,
      requestData: error.config?.data
    });

    await handleApiError(error);
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