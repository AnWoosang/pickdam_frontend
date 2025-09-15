'use client';

import { useState, useCallback, useMemo } from 'react';
import { validateNickname } from '@/shared/validation/common';
import { useNicknameCheck as useNicknameCheckQuery } from '@/domains/user/hooks/useUserQueries';

export function useNicknameCheck() {
  const [nickname, setNickname] = useState('');
  const [checkNickname, setCheckNickname] = useState<string>('');
  
  // 중복확인 API 호출
  const { data: checkResult, isLoading, error: apiError } = useNicknameCheckQuery(checkNickname);
  
  // 검증 결과를 메모이제이션
  const validationResult = useMemo(() => {
    const validationError = validateNickname(nickname);
    
    // 상태 계산
    let status = 'idle';
    let error = '';
    
    // 1. 유효성 검사 실패
    if (validationError) {
      status = 'invalid';
      error = validationError;
    }
    // 2. 중복확인 진행중
    else if (checkNickname && isLoading) {
      status = 'checking';
    }
    // 3. 중복확인 오류
    else if (checkNickname && apiError) {
      status = 'error';
      error = '중복확인 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
    // 4. 중복확인 완료
    else if (checkNickname && checkResult) {
      if (!checkResult.isDuplicate) {
        status = 'available';
      } else {
        status = 'duplicate';
        error = '이미 사용 중인 닉네임입니다.';
      }
    }
    
    const isValid = status === 'available';
    const canCheck = !validationError && nickname.trim() !== '' && status !== 'checking';
    
    return {
      status,
      error,
      isValid,
      canCheck
    };
  }, [nickname, checkNickname, checkResult, isLoading, apiError]);
  
  // 닉네임 변경 핸들러
  const handleNicknameChange = useCallback((newNickname: string) => {
    setNickname(newNickname);
    setCheckNickname(''); // 닉네임이 변경되면 중복확인 상태 초기화
  }, []);
  
  // 중복확인 실행
  const handleCheckDuplicate = useCallback((nicknameToCheck: string) => {
    // 유효성 검사를 통과한 경우에만 중복확인 실행
    const trimmedNickname = nicknameToCheck.trim();
    const validationError = validateNickname(trimmedNickname);
    
    if (!validationError && trimmedNickname) {
      setCheckNickname(trimmedNickname);
    }
  }, []);
  
  // 상태 초기화
  const resetStatus = useCallback(() => {
    setCheckNickname('');
  }, []);

  return {
    nickname,
    validationResult,
    // 하위 호환성을 위한 기존 인터페이스 유지  
    nicknameStatus: validationResult.status,
    error: validationResult.error,
    isChecking: isLoading,
    handleNicknameChange,
    handleCheckDuplicate,
    resetStatus,
  };
}