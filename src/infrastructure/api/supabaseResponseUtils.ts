import { v4 as uuidv4 } from 'uuid'
import { 
  AuthApiError,
  StorageError,
  isAuthApiError,
  isAuthSessionMissingError,
  isAuthWeakPasswordError,
  isStorageError,
  HTTP_STATUS_CODES 
} from '@/infrastructure/errors/SupabaseErrorTypes'
import { 
  ApiResponse, 
  ApiMetaData, 
  PaginationInfo, 
  PaginatedResponse, 
  MappedError 
} from '@/shared/api/types'
import { ApiErrorCode, API_ERROR_MESSAGES } from '@/shared/error/errorCodes'
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
 * ApiErrorCode에 따른 HTTP 상태 코드 반환
 */
export function getStatusFromErrorCode(errorCode: string): number {
  switch (errorCode) {
    case ApiErrorCode.INVALID_INPUT:
    case ApiErrorCode.MISSING_REQUIRED_FIELD:
    case ApiErrorCode.INVALID_FILE_TYPE:
    case ApiErrorCode.FILE_TOO_LARGE:
      return HTTP_STATUS_CODES.BAD_REQUEST
      
    case ApiErrorCode.UNAUTHORIZED:
    case ApiErrorCode.SESSION_EXPIRED:
    case ApiErrorCode.INVALID_CREDENTIALS:
      return HTTP_STATUS_CODES.UNAUTHORIZED
      
    case ApiErrorCode.FORBIDDEN:
      return HTTP_STATUS_CODES.FORBIDDEN
      
    case ApiErrorCode.NOT_FOUND:
    case ApiErrorCode.USER_NOT_FOUND:
      return HTTP_STATUS_CODES.NOT_FOUND
      
    case ApiErrorCode.ALREADY_EXISTS:
    case ApiErrorCode.EMAIL_ALREADY_EXISTS:
      return HTTP_STATUS_CODES.CONFLICT
      
    case ApiErrorCode.TOO_MANY_REQUESTS:
      return HTTP_STATUS_CODES.TOO_MANY_REQUESTS
      
    default:
      return HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
  }
}

/**
 * Auth 에러 매핑 함수 (Built-in 유틸리티 활용)
 */
function mapAuthApiError(error: AuthApiError): MappedError {
  // HTTP 상태 코드 기반으로 분류
  switch (error.status) {
    case HTTP_STATUS_CODES.BAD_REQUEST:
      if (error.message.includes('invalid') || error.message.includes('credentials')) {
        return {
          code: ApiErrorCode.INVALID_CREDENTIALS,
          message: API_ERROR_MESSAGES[ApiErrorCode.INVALID_CREDENTIALS],
          details: error.message
        }
      }
      break
      
    case HTTP_STATUS_CODES.UNAUTHORIZED:
      return {
        code: ApiErrorCode.UNAUTHORIZED,
        message: API_ERROR_MESSAGES[ApiErrorCode.UNAUTHORIZED],
        details: error.message
      }
      
    case HTTP_STATUS_CODES.FORBIDDEN:
      return {
        code: ApiErrorCode.FORBIDDEN,
        message: API_ERROR_MESSAGES[ApiErrorCode.FORBIDDEN],
        details: error.message
      }
      
    case HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY:
      if (error.message.includes('weak') || error.message.includes('password')) {
        return {
          code: ApiErrorCode.WEAK_PASSWORD,
          message: API_ERROR_MESSAGES[ApiErrorCode.WEAK_PASSWORD],
          details: error.message
        }
      }
      if (error.message.includes('email') && error.message.includes('exists')) {
        return {
          code: ApiErrorCode.EMAIL_ALREADY_EXISTS,
          message: API_ERROR_MESSAGES[ApiErrorCode.EMAIL_ALREADY_EXISTS],
          details: error.message
        }
      }
      break
      
    case HTTP_STATUS_CODES.TOO_MANY_REQUESTS:
      return {
        code: ApiErrorCode.TOO_MANY_REQUESTS,
        message: API_ERROR_MESSAGES[ApiErrorCode.TOO_MANY_REQUESTS],
        details: error.message
      }
  }
  
  // 기본 처리
  return {
    code: ApiErrorCode.INTERNAL_SERVER_ERROR,
    message: API_ERROR_MESSAGES[ApiErrorCode.INTERNAL_SERVER_ERROR],
    details: error.message
  }
}

/**
 * Storage 에러 매핑 함수 (Built-in 유틸리티 활용)
 */
function mapStorageApiError(error: StorageError): MappedError {
  const errorMessage = error.message.toLowerCase()
  
  // 파일 크기 관련
  if (errorMessage.includes('file') && (errorMessage.includes('large') || errorMessage.includes('size'))) {
    return {
      code: ApiErrorCode.FILE_TOO_LARGE,
      message: API_ERROR_MESSAGES[ApiErrorCode.FILE_TOO_LARGE],
      details: error.message
    }
  }
  
  // 파일 형식 관련
  if (errorMessage.includes('file') && errorMessage.includes('type')) {
    return {
      code: ApiErrorCode.INVALID_FILE_TYPE,
      message: API_ERROR_MESSAGES[ApiErrorCode.INVALID_FILE_TYPE],
      details: error.message
    }
  }
  
  // 할당량 초과
  if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
    return {
      code: ApiErrorCode.QUOTA_EXCEEDED,
      message: API_ERROR_MESSAGES[ApiErrorCode.QUOTA_EXCEEDED],
      details: error.message
    }
  }
  
  // 파일 없음
  if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
    return {
      code: ApiErrorCode.NOT_FOUND,
      message: API_ERROR_MESSAGES[ApiErrorCode.NOT_FOUND],
      details: error.message
    }
  }
  
  // 권한 없음
  if (errorMessage.includes('permission') || errorMessage.includes('access')) {
    return {
      code: ApiErrorCode.FORBIDDEN,
      message: API_ERROR_MESSAGES[ApiErrorCode.FORBIDDEN],
      details: error.message
    }
  }
  
  // 기본 처리
  return {
    code: ApiErrorCode.INTERNAL_SERVER_ERROR,
    message: API_ERROR_MESSAGES[ApiErrorCode.INTERNAL_SERVER_ERROR],
    details: error.message
  }
}

/**
 * HTTP 상태 코드 기반 에러 매핑 (Database 등 일반 에러용)
 */
function mapByHttpStatus(error: unknown): MappedError {
  const errorObj = error as { status?: number; statusCode?: number; message?: string };
  const status = errorObj.status || errorObj.statusCode
  
  switch (status) {
    case HTTP_STATUS_CODES.BAD_REQUEST:
      return {
        code: ApiErrorCode.INVALID_INPUT,
        message: API_ERROR_MESSAGES[ApiErrorCode.INVALID_INPUT],
        details: errorObj.message
      }
      
    case HTTP_STATUS_CODES.UNAUTHORIZED:
      return {
        code: ApiErrorCode.UNAUTHORIZED,
        message: API_ERROR_MESSAGES[ApiErrorCode.UNAUTHORIZED],
        details: errorObj.message
      }
      
    case HTTP_STATUS_CODES.FORBIDDEN:
      return {
        code: ApiErrorCode.FORBIDDEN,
        message: API_ERROR_MESSAGES[ApiErrorCode.FORBIDDEN],
        details: errorObj.message
      }
      
    case HTTP_STATUS_CODES.NOT_FOUND:
      return {
        code: ApiErrorCode.NOT_FOUND,
        message: API_ERROR_MESSAGES[ApiErrorCode.NOT_FOUND],
        details: errorObj.message
      }
      
    case HTTP_STATUS_CODES.CONFLICT:
      return {
        code: ApiErrorCode.ALREADY_EXISTS,
        message: API_ERROR_MESSAGES[ApiErrorCode.ALREADY_EXISTS],
        details: errorObj.message
      }
      
    case HTTP_STATUS_CODES.TOO_MANY_REQUESTS:
      return {
        code: ApiErrorCode.TOO_MANY_REQUESTS,
        message: API_ERROR_MESSAGES[ApiErrorCode.TOO_MANY_REQUESTS],
        details: errorObj.message
      }
      
    default:
      return {
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: API_ERROR_MESSAGES[ApiErrorCode.INTERNAL_SERVER_ERROR],
        details: errorObj.message
      }
  }
}
/**
 * 통합 API 에러 매핑 함수 (Built-in 유틸리티 활용)
 */
export function mapApiError(error: unknown): MappedError {
  // 간단한 에러 로깅 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error)
  }

  // 1. Auth 에러 - Built-in 유틸리티 활용
  if (isAuthApiError(error)) {
    return mapAuthApiError(error)
  }
  
  // 특별한 Auth 에러 케이스들
  if (isAuthSessionMissingError(error)) {
    return {
      code: ApiErrorCode.UNAUTHORIZED,
      message: API_ERROR_MESSAGES[ApiErrorCode.UNAUTHORIZED],
      details: error.message
    }
  }
  
  if (isAuthWeakPasswordError(error)) {
    return {
      code: ApiErrorCode.WEAK_PASSWORD,
      message: API_ERROR_MESSAGES[ApiErrorCode.WEAK_PASSWORD],
      details: error.message,
    }
  }
  
  // 2. Storage 에러 - Built-in 유틸리티 활용
  if (isStorageError(error)) {
    return mapStorageApiError(error)
  }
  
  // 3. 일반 에러 - HTTP 상태 코드로 처리
  return mapByHttpStatus(error)
}



