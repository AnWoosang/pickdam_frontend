'use client';

import { useState, useCallback, useMemo } from 'react';
import { validateEmail } from '@/shared/validation/common';
import { useEmailCheck as useEmailCheckQuery } from '@/domains/user/hooks/useUserQueries';

// 이메일 검증 상태 타입 정의
export type EmailStatus =
  | 'idle'        // 초기 상태
  | 'invalid'     // 이메일 형식 유효하지 않음
  | 'checking'    // 중복 확인 중
  | 'available'   // 사용 가능
  | 'duplicate'   // 중복됨
  | 'error';      // API 에러

// 이메일 검증 결과
export interface EmailValidationResult {
  status: EmailStatus;
  error: string;
  isValid: boolean;
  canCheck: boolean;
}

export function useEmailCheck() {
  const [email, setEmail] = useState('');
  const [checkEmail, setCheckEmail] = useState<string>('');
  
  // 이메일 중복확인 API 호출
  const { data: checkResult, isLoading, error: apiError } = useEmailCheckQuery(checkEmail);
  
  // 이메일 검증 결과를 메모이제이션
  const validationResult: EmailValidationResult = useMemo(() => {
    const validationError = validateEmail(email);
    
    // 상태 계산
    let status: EmailStatus = 'idle';
    let error = '';
    
    // 1. 유효성 검사 실패
    if (validationError) {
      status = 'invalid';
      error = validationError;
    }
    // 2. 중복확인 진행중
    else if (checkEmail && isLoading) {
      status = 'checking';
    }
    // 3. 중복확인 오류
    else if (checkEmail && apiError) {
      status = 'error';
      error = '이메일 중복확인 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
    // 4. 중복확인 완료
    else if (checkEmail && checkResult) {
      if (checkResult.isAvailable) {
        status = 'available';
      } else {
        status = 'duplicate';
        error = '이미 사용 중인 이메일입니다.';
      }
    }
    
    const isValid = status === 'available';
    const canCheck = !validationError && email.trim() !== '' && status !== 'checking';
    
    return {
      status,
      error,
      isValid,
      canCheck
    };
  }, [email, checkEmail, checkResult, isLoading, apiError]);
  
  // 이메일 변경 핸들러
  const handleEmailChange = useCallback((newEmail: string) => {
    setEmail(newEmail);
    // 이메일이 변경되면 중복확인 상태 초기화
    setCheckEmail('');
  }, []);
  
  // 중복확인 실행
  const handleCheckDuplicate = useCallback((emailToCheck: string) => {
    // 유효성 검사를 통과한 경우에만 중복확인 실행
    const trimmedEmail = emailToCheck.trim();
    const validationError = validateEmail(trimmedEmail);
    
    if (!validationError && trimmedEmail) {
      setCheckEmail(trimmedEmail);
    }
  }, []);
  
  // 상태 초기화
  const resetStatus = useCallback(() => {
    setCheckEmail('');
  }, []);

  return {
    email,
    validationResult,
    // 하위 호환성을 위한 기존 인터페이스 유지
    emailStatus: validationResult.status,
    error: validationResult.error,
    isChecking: isLoading,
    handleEmailChange,
    handleCheckDuplicate,
    resetStatus
  };
}