// API 에러 코드 및 메시지 정의

export enum ApiErrorCode {
  // 인증 관련
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_MISSING = 'SESSION_MISSING',
  IS_DELETED = 'IS_DELETED',
  
  // 유효성 검증
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // 리소스 관련
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // 비즈니스 로직
  INSUFFICIENT_PERMISSION = 'INSUFFICIENT_PERMISSION',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  // 시스템 에러
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // 네트워크 관련
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // 파일 관련
  STORAGE_ERROR = 'STORAGE_ERROR'
}

// 에러 코드별 기본 메시지
export const API_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  // 인증 관련
  [ApiErrorCode.UNAUTHORIZED]: '로그인이 필요합니다.',
  [ApiErrorCode.FORBIDDEN]: '접근 권한이 없습니다.',
  [ApiErrorCode.TOKEN_EXPIRED]: '로그인이 만료되었습니다. 다시 로그인해주세요.',
  [ApiErrorCode.INVALID_TOKEN]: '유효하지 않은 토큰입니다.',
  [ApiErrorCode.EMAIL_NOT_VERIFIED]: '이메일 인증이 필요합니다. 이메일을 확인해주세요.',
  [ApiErrorCode.INVALID_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다.',
  [ApiErrorCode.USER_NOT_FOUND]: '가입되지 않은 이메일입니다.',
  [ApiErrorCode.EMAIL_ALREADY_EXISTS]: '이미 가입된 이메일입니다.',
  [ApiErrorCode.WEAK_PASSWORD]: '비밀번호는 8자 이상, 영문+숫자+특수문자 조합으로 설정해주세요.',
  [ApiErrorCode.TOO_MANY_REQUESTS]: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ApiErrorCode.SESSION_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요.',
  [ApiErrorCode.SESSION_MISSING]: '로그인이 필요합니다.',
  [ApiErrorCode.IS_DELETED]: '삭제된 회원입니다.',
  
  // 유효성 검증
  [ApiErrorCode.VALIDATION_ERROR]: '입력값이 올바르지 않습니다.',
  [ApiErrorCode.INVALID_INPUT]: '잘못된 입력값입니다.',
  [ApiErrorCode.MISSING_REQUIRED_FIELD]: '필수 입력 항목이 누락되었습니다.',
  
  // 리소스 관련
  [ApiErrorCode.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [ApiErrorCode.ALREADY_EXISTS]: '이미 존재하는 항목입니다.',
  [ApiErrorCode.CONFLICT]: '요청이 현재 상태와 충돌합니다.',
  
  // 비즈니스 로직
  [ApiErrorCode.INSUFFICIENT_PERMISSION]: '권한이 부족합니다.',
  [ApiErrorCode.OPERATION_NOT_ALLOWED]: '허용되지 않은 작업입니다.',
  [ApiErrorCode.QUOTA_EXCEEDED]: '할당량을 초과했습니다.',
  
  // 시스템 에러
  [ApiErrorCode.INTERNAL_SERVER_ERROR]: '서버 내부 오류가 발생했습니다.',
  [ApiErrorCode.SERVICE_UNAVAILABLE]: '서비스를 사용할 수 없습니다.',
  [ApiErrorCode.EXTERNAL_SERVICE_ERROR]: '외부 서비스 연동 중 오류가 발생했습니다.',
  [ApiErrorCode.DATABASE_ERROR]: '데이터베이스 오류가 발생했습니다.',
  
  // 네트워크 관련
  [ApiErrorCode.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
  [ApiErrorCode.STORAGE_ERROR]: '파일 저장 중 오류가 발생했습니다.'
};