import { AxiosError } from 'axios';

/**
 * 간단한 에러 메시지 매핑 유틸리티
 */
export const getErrorMessage = (error: unknown): string => {
  // AxiosError인 경우
  if (error instanceof AxiosError) {
    // 네트워크 에러 (응답 없음)
    if (!error.response) {
      return '인터넷 연결을 확인하고 다시 시도해주세요.';
    }

    const status = error.response.status;

    // HTTP 상태 코드별 메시지
    switch (status) {
      case 400:
        return '잘못된 요청입니다.';
      case 401:
        return '로그인이 필요합니다.';
      case 403:
        return '권한이 없습니다.';
      case 404:
        return '요청하신 정보를 찾을 수 없습니다.';
      case 409:
        return '이미 존재하는 데이터입니다.';
      case 429:
        return '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.';
      default:
        return '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  }

  // JavaScript Error인 경우
  if (error instanceof Error) {
    return error.message || '예상치 못한 오류가 발생했습니다.';
  }

  // 기타
  return '알 수 없는 오류가 발생했습니다.';
};

/**
 * 재시도 가능한 에러인지 판단
 */
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    if (!error.response) return true; // 네트워크 에러는 재시도 가능

    const status = error.response.status;
    return status === 408 || status === 429 || status === 502 || status === 503 || status === 504;
  }

  return false;
};

/**
 * 401 Unauthorized 에러인지 판단
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};