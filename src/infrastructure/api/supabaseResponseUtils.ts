import { v4 as uuidv4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'
import {
  AuthApiError,
  StorageError,
  PostgresError,
  isAuthApiError,
  isAuthSessionMissingError,
  isAuthWeakPasswordError,
  isStorageError,
  isPostgresError
} from '@/infrastructure/errors/SupabaseErrorTypes'
import { 
  ApiResponse, 
  ApiMetaData, 
  PaginationInfo, 
  PaginatedResponse, 
  MappedError 
} from '@/shared/api/types'
import { ApiErrorCode } from '@/shared/error/errorCodes'
/**
 * 메타데이터 생성 헬퍼
 */
function createMetadata(): ApiMetaData {
  return {
    requestId: uuidv4(),
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
  }
}

/**
 * 공통 성공 응답 생성 헬퍼 (ApiResponse 형식)
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    metadata: createMetadata()
  }
}

/**
 * 페이지네이션 성공 응답 생성 헬퍼 (PaginatedResponse 형식)
 */
export function createPaginatedResponse<T>(data: T[], pagination: PaginationInfo): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination,
    metadata: createMetadata()
  }
}

/**
 * 공통 에러 응답 생성 헬퍼 (ApiResponse 형식)
 */
export function createErrorResponse(error: MappedError): ApiResponse {
  return {
    success: false,
    error,
    metadata: createMetadata()
  }
}

/**
 * Auth 에러 매핑 함수 (Built-in 유틸리티 활용)
 */
function mapAuthApiError(error: AuthApiError): MappedError {
  // 이메일 미인증 에러 특별 처리
  if (error.message && error.message.includes('Email not confirmed')) {
    return {
      statusCode: StatusCodes.FORBIDDEN,
      errorCode: 'EMAIL_NOT_VERIFIED' as ApiErrorCode,
      message: 'Email verification required',
      details: error.message
    }
  }

  // 잘못된 로그인 정보 에러 처리
  if (error.message && error.message.includes('Invalid login credentials')) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      errorCode: ApiErrorCode.INVALID_CREDENTIALS,
      message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      details: error.message
    }
  }

  // 동일한 비밀번호 에러 처리
  if (error.code === 'same_password' ||
      (error.message && error.message.includes('New password should be different from the old password'))) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      errorCode: ApiErrorCode.SAME_PASSWORD,
      message: error.message,
      details: error.message
    }
  }

  // Auth 에러는 원본 정보 그대로 사용
  return {
    statusCode: error.status,
    errorCode: error.message, // 원본 에러 메시지를 errorCode로 사용
    message: error.message,
    details: error.message
  }
}

/**
 * Storage 에러 매핑 함수 (Built-in 유틸리티 활용)
 */
function mapStorageApiError(error: StorageError): MappedError {
  // Storage 에러는 보통 400 Bad Request
  return {
    statusCode: StatusCodes.BAD_REQUEST,
    errorCode: ApiErrorCode.STORAGE_ERROR,
    message: error.message,
    details: error.message
  }
}


function mapPostgresCodeToHttpStatus(pgCode: string): number {
  switch (pgCode) {
    case 'PGRST116': // No rows returned (single() 사용 시 0개 결과)
      return StatusCodes.NOT_FOUND
    case 'PGRST117': // More than one row returned (single() 사용 시 2개 이상 결과)
      return StatusCodes.CONFLICT
    case 'PGRST301': // Parse error (잘못된 쿼리)
      return StatusCodes.BAD_REQUEST
    case 'PGRST204': // Invalid range headers
      return StatusCodes.BAD_REQUEST

    // PostgreSQL 에러 코드들
    case '23505': // unique_violation (중복 키)
      return StatusCodes.CONFLICT
    case '23503': // foreign_key_violation (외래키 위반)
      return StatusCodes.BAD_REQUEST
    case '23502': // not_null_violation (필수 필드 누락)
      return StatusCodes.BAD_REQUEST
    case '23514': // check_violation (체크 제약 조건 위반)
      return StatusCodes.BAD_REQUEST
    case '42P01': // undefined_table (테이블 없음)
      return StatusCodes.NOT_FOUND
    case '42703': // undefined_column (컬럼 없음)
      return StatusCodes.BAD_REQUEST
    case '08006': // connection_failure (연결 실패)
      return StatusCodes.SERVICE_UNAVAILABLE
    case '53300': // too_many_connections (연결 수 초과)
      return StatusCodes.SERVICE_UNAVAILABLE
    case '40001': // serialization_failure (트랜잭션 충돌)
      return StatusCodes.CONFLICT
    case '22001': // string_data_right_truncation (문자열 길이 초과)
      return StatusCodes.BAD_REQUEST
    case '22003': // numeric_value_out_of_range (숫자 범위 초과)
      return StatusCodes.BAD_REQUEST
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR
  }
}

function mapPostgresError(error: PostgresError): MappedError {
  // RPC 에러 메시지 기반 우선 처리
  const message = error.message || '';
  let statusCode = mapPostgresCodeToHttpStatus(error.code);
  let errorCode: ApiErrorCode;

  if (message.includes('Unauthorized') || message.includes('User not logged in')) {
    statusCode = StatusCodes.UNAUTHORIZED;
    errorCode = ApiErrorCode.UNAUTHORIZED;
  } else if (message.includes('Forbidden') || message.includes('You can only')) {
    statusCode = StatusCodes.FORBIDDEN;
    errorCode = ApiErrorCode.FORBIDDEN;
  } else if (message.includes('not found') || message.includes('already deleted')) {
    statusCode = StatusCodes.NOT_FOUND;
    errorCode = ApiErrorCode.NOT_FOUND;
  } else if (error.code === 'P0001' && message.includes('Nickname can only be changed once per month')) {
    statusCode = StatusCodes.BAD_REQUEST;
    errorCode = ApiErrorCode.NICKNAME_CHANGE_LIMIT_EXCEEDED;
  } else {
    // 기존 PostgreSQL 에러 코드 매핑
    switch (error.code) {
      case 'PGRST116': // No rows returned
        errorCode = ApiErrorCode.NOT_FOUND
        break
      case 'PGRST117': // More than one row returned
        errorCode = ApiErrorCode.CONFLICT
        break
      case '23505': // unique_violation
        errorCode = ApiErrorCode.ALREADY_EXISTS
        break
      case '23503': // foreign_key_violation
      case '23502': // not_null_violation
        errorCode = ApiErrorCode.INVALID_INPUT
        break
      default:
        errorCode = ApiErrorCode.DATABASE_ERROR
    }
  }

  return {
    statusCode: statusCode,
    errorCode: errorCode,
    message: error.message,
    details: error.details
  }
}

/**
 * HTTP 상태 코드 기반 에러 매핑 (Database 등 일반 에러용)
 */
function mapByHttpStatus(error: unknown): MappedError {
  const errorObj = error as { status?: number; statusCode?: number; message?: string; code?: string };
  let status = errorObj.status || errorObj.statusCode || StatusCodes.INTERNAL_SERVER_ERROR

  // RPC 에러 메시지 기반 상태 코드 매핑
  const message = errorObj.message || '';
  if (message.includes('Unauthorized') || message.includes('User not logged in')) {
    status = StatusCodes.UNAUTHORIZED;
  } else if (message.includes('Forbidden') || message.includes('You can only')) {
    status = StatusCodes.FORBIDDEN;
  } else if (message.includes('not found') || message.includes('already deleted')) {
    status = StatusCodes.NOT_FOUND;
  }

  // 커스텀 코드 우선 처리
  if (errorObj.code === 'EMAIL_NOT_VERIFIED') {
    return {
      statusCode: status,
      errorCode: 'EMAIL_NOT_VERIFIED' as ApiErrorCode,
      message: errorObj.message || '이메일 인증이 필요합니다.',
      details: errorObj.message || '이메일 인증이 필요합니다.'
    }
  }

  // HTTP 상태 코드에 따른 적절한 ApiErrorCode 매핑
  let errorCode: ApiErrorCode

  switch (status) {
    case StatusCodes.BAD_REQUEST:
      errorCode = ApiErrorCode.INVALID_INPUT
      break
    case StatusCodes.UNAUTHORIZED:
      errorCode = ApiErrorCode.UNAUTHORIZED
      break
    case StatusCodes.FORBIDDEN:
      errorCode = ApiErrorCode.FORBIDDEN
      break
    case StatusCodes.NOT_FOUND:
      errorCode = ApiErrorCode.NOT_FOUND
      break
    case StatusCodes.CONFLICT:
      errorCode = ApiErrorCode.CONFLICT
      break
    case StatusCodes.UNPROCESSABLE_ENTITY:
      errorCode = ApiErrorCode.VALIDATION_ERROR
      break
    case StatusCodes.TOO_MANY_REQUESTS:
      errorCode = ApiErrorCode.TOO_MANY_REQUESTS
      break
    case StatusCodes.SERVICE_UNAVAILABLE:
      errorCode = ApiErrorCode.SERVICE_UNAVAILABLE
      break
    case StatusCodes.INTERNAL_SERVER_ERROR:
    default:
      errorCode = ApiErrorCode.INTERNAL_SERVER_ERROR
      break
  }

  return {
    statusCode: status,
    errorCode: errorCode,
    message: errorObj.message || 'Unknown error',
    details: errorObj.message
  }
}
/**
 * 통합 API 에러 매핑 함수 (Built-in 유틸리티 활용)
 */
export function mapApiError(error: unknown): MappedError {
  // 간단한 에러 로깅 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    // console.error('API Error:', error)
  }

  // 특별한 Auth 에러 케이스들
  if (isAuthSessionMissingError(error)) {
    return {
      statusCode: error.status,
      errorCode: ApiErrorCode.SESSION_MISSING,
      message: error.message,
      details: error.message
    }
  }

  if (isAuthWeakPasswordError(error)) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      errorCode: ApiErrorCode.WEAK_PASSWORD,
      message: error.message,
      details: error.message
    }
  }

  if (isAuthApiError(error)) {
    return mapAuthApiError(error)
  }

  if (isPostgresError(error)) {
    return mapPostgresError(error)
  }

  if (isStorageError(error)) {
    return mapStorageApiError(error)
  }

  return mapByHttpStatus(error)
}