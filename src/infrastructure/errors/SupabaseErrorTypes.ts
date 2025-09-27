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


// PostgreSQL/PostgREST 에러 타입
export interface PostgresError {
  code: string
  message: string
  details: string
  hint: string
}

// PostgreSQL 에러 타입 가드
export function isPostgresError(error: unknown): error is PostgresError {
  if (typeof error !== 'object' || error === null) return false;

  const errorObj = error as Record<string, unknown>;

  return 'code' in errorObj &&
         typeof errorObj.code === 'string' &&
         'message' in errorObj &&
         typeof errorObj.message === 'string' &&
         'details' in errorObj &&
         'hint' in errorObj;
}

// 에러 심각도 레벨
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}