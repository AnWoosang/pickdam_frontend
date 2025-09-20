import { BusinessError } from './BusinessError';
import toast from 'react-hot-toast';

/**
 * BusinessError 메시지 추출 유틸리티 (사용자 친화적 메시지 제공)
 */
export const getErrorMessage = (error: BusinessError): string => {
  // 500번대 서버 에러는 사용자 친화적 메시지로 변환
  if (error.statusCode >= 500) {
    return '일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }

  // 네트워크 에러 (statusCode === 0)
  if (error.statusCode === 0) {
    return '인터넷 연결을 확인하고 다시 시도해주세요.';
  }

  // 기타 에러는 원본 메시지 사용
  return error.message;
};

export const showErrorToast = (error: BusinessError): void => {
  const message = getErrorMessage(error);

  // 네트워크 에러나 서버 에러는 더 긴 시간 표시
  if (error.statusCode === 0 || error.statusCode >= 500) {
    toast.error(message, { duration: 5000 });
  } else {
    toast.error(message);
  }
};

