/**
 * Supabase 에러 처리 유틸리티
 * Auth는 built-in 유틸리티 활용, 나머지는 HTTP 상태 코드로 처리
 */

// Auth 에러 built-in 유틸리티
import {
  AuthError,
  AuthApiError,
  isAuthError,
  isAuthApiError,
  isAuthSessionMissingError,
  isAuthWeakPasswordError,
  isAuthRetryableFetchError
} from '@supabase/supabase-js'

// Storage 에러 built-in 유틸리티
import {
  StorageError,
  isStorageError
} from '@supabase/storage-js'

// 공식 타입들 re-export
export type { AuthError, AuthApiError, StorageError }

// Built-in 유틸리티들 re-export
export {
  isAuthError,
  isAuthApiError,
  isAuthSessionMissingError,
  isAuthWeakPasswordError,
  isAuthRetryableFetchError,
  isStorageError
}

// 앱에서 특별히 처리해야 하는 주요 HTTP 상태 코드들만 유지
export const HTTP_STATUS_CODES = {
  // 클라이언트 에러
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // 서버 에러
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const

// 에러 심각도 레벨
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}