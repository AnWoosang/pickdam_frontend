// 공통 API 응답 포맷 타입 정의
export interface ApiMetaData {
  requestId : string;
  timestamp : string;
  version : string;
}

// 통합 에러 응답 타입
export interface MappedError {
  statusCode: number      // HTTP 상태 코드
  errorCode: string       // 에러 구분용 코드 (PGRST116, TOKEN_EXPIRED 등)
  message: string
  details?: string        // Supabase 원본 메시지
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: MappedError;
  metadata : ApiMetaData;
}

// 페이지네이션 정보
export interface PaginationInfo {
  total: number;
  page: number;
  limit?: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

// 페이지네이션된 응답을 위한 제네릭 타입
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}