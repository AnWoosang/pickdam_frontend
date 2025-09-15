import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { BusinessError } from '@/shared/error'
import { ApiErrorCode, API_ERROR_MESSAGES } from '@/shared/error/errorCodes'
import { useAuthStore } from '@/domains/auth/store/authStore'
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

// 요청 인터셉터
axiosClient.interceptors.request.use(
  (config) => {
    // 요청 전 처리
    console.log(`🚀 [axiosClient] API Request: ${config.method?.toUpperCase()} ${config.url}`)
    
    
    // 이미지 업로드 요청인 경우 추가 로그
    if (config.url === '/upload-image') {
      console.log('🖼️ [axiosClient] 이미지 업로드 요청 감지:', {
        method: config.method,
        url: config.url,
        headers: config.headers,
        hasData: !!config.data
      });
      
      // 스택 트레이스 출력으로 호출 위치 확인
      console.trace('🔍 [axiosClient] 이미지 업로드 요청의 호출 스택:');
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
    console.log('🔔 [axiosClient] Headers:', response.headers)
    return response
  },
  (error) => {
    console.error('❌ [axiosClient] 에러 인터셉터 호출:', {
      error,
      message: error?.message,
      status: error?.response?.status,
      url: error?.config?.url,
      method: error?.config?.method
    });

    let businessError: BusinessError;

    try {
      // 1. 백엔드 ApiResponse 형태의 에러 처리 (최우선)
      if (error.response?.data && !error.response.data.success && error.response.data.error) {
        const errorData = error.response.data.error;
        businessError = new BusinessError(
          errorData.code || 'API_ERROR',
          errorData.message,
          error.response.status || 500,
          errorData.details,
          {
            ...errorData.metadata,
            requestId: error.response.data.metadata?.requestId,
            timestamp: error.response.data.metadata?.timestamp
          }
        );
      }
      // 2. HTTP 상태코드별 처리 (백엔드에서 구조화된 에러를 보내지 않은 경우)
      else if (error.response?.status) {
        businessError = createBusinessErrorFromStatus(error.response.status, error.config?.url);
      }
      // 3. 모든 기타 에러 - 네트워크, 타임아웃, 취소 등 모든 예외 상황 일반화 처리
      else {
        businessError = new BusinessError(
          ApiErrorCode.INTERNAL_SERVER_ERROR,
          error.message || API_ERROR_MESSAGES[ApiErrorCode.INTERNAL_SERVER_ERROR],
          500,
          `원본 에러 정보: ${JSON.stringify({ code: error.code, message: error.message, name: error.name })}`
        );
      }

      // 최종 처리된 에러 로깅 (간소화)
      if (process.env.NODE_ENV === 'development') {
        console.error('🔄 [axiosClient] API Error:', error);
      }
      console.log('🔄 [axiosClient] BusinessError 생성:', businessError.toJSON());
      
    } catch (processingError) {
      console.error('❌ [axiosClient] 에러 처리 중 예상치 못한 오류:', processingError);
      console.error('❌ [axiosClient] 원본 에러:', error);
      
      // 에러 처리 로직 자체에서 문제가 발생한 경우의 최후 방어선
      businessError = new BusinessError(
        ApiErrorCode.INTERNAL_SERVER_ERROR,
        '시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        500,
        `Error processing failed: ${processingError instanceof Error ? processingError.message : String(processingError)}`
      );
    }

    throw businessError;
  }
)

// HTTP 상태코드별 BusinessError 생성 헬퍼 함수
function createBusinessErrorFromStatus(status: number, url?: string): BusinessError {
  const details = `Request to ${url || 'unknown'}`;
  
  switch (status) {
    case 401:
      // 401 에러 시 로그인 모달 자동 열기 및 toast 메시지
      useAuthStore.getState().openLoginModal();
      toast.error('로그인이 필요한 서비스입니다.');
      return new BusinessError(ApiErrorCode.UNAUTHORIZED, API_ERROR_MESSAGES[ApiErrorCode.UNAUTHORIZED], 401, details);
    case 403:
      return new BusinessError(ApiErrorCode.FORBIDDEN, API_ERROR_MESSAGES[ApiErrorCode.FORBIDDEN], 403, details);
    case 404:
      return new BusinessError(ApiErrorCode.NOT_FOUND, API_ERROR_MESSAGES[ApiErrorCode.NOT_FOUND], 404, details);
    case 409:
      return new BusinessError(ApiErrorCode.CONFLICT, API_ERROR_MESSAGES[ApiErrorCode.CONFLICT], 409, details);
    case 422:
      return new BusinessError(ApiErrorCode.VALIDATION_ERROR, API_ERROR_MESSAGES[ApiErrorCode.VALIDATION_ERROR], 422, details);
    case 429:
      return new BusinessError(ApiErrorCode.TOO_MANY_REQUESTS, API_ERROR_MESSAGES[ApiErrorCode.TOO_MANY_REQUESTS], 429, `Rate limit exceeded for ${url}`);
    default:
      if (status >= 500) {
        return new BusinessError(ApiErrorCode.INTERNAL_SERVER_ERROR, API_ERROR_MESSAGES[ApiErrorCode.INTERNAL_SERVER_ERROR], status, `Server returned ${status} for ${url}`);
      }
      return new BusinessError(ApiErrorCode.INTERNAL_SERVER_ERROR, `HTTP ${status} 에러가 발생했습니다.`, status, details);
  }
}

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