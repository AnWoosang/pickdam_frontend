'use client';

import { useState, useCallback, useEffect } from 'react';
import { useNicknameCheck } from '@/shared/hooks/useNicknameCheck';

// 에러 메시지 상수
const ERROR_MESSAGES = {
  SAME_NICKNAME: '현재 닉네임과 동일합니다.',
  MONTHLY_LIMIT: '닉네임은 한 달에 한 번만 변경할 수 있습니다.',
  DUPLICATE: '이미 사용 중인 닉네임입니다.',
  VALIDATION_REQUIRED: '닉네임 중복확인을 완료해주세요.',
  DEFAULT: '닉네임 변경에 실패했습니다. 다시 시도해주세요.'
} as const;

interface UseNicknameEditProps {
  currentNickname: string;
  onSave: (nickname: string) => Promise<void>;
}

export function useNicknameEdit({ currentNickname, onSave }: UseNicknameEditProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');
  
  // 공통 닉네임 검증 훅 사용
  const {
    nickname,
    nicknameStatus,
    error: validationError,
    isChecking,
    handleNicknameChange
  } = useNicknameCheck();

  // 초기값 설정
  useEffect(() => {
    handleNicknameChange(currentNickname);
  }, [currentNickname, handleNicknameChange]);

  // 프로필 수정 관련 로직
  const isNicknameChanged = nickname.trim() !== currentNickname;
  const resetNickname = useCallback(() => {
    handleNicknameChange(currentNickname);
  }, [currentNickname, handleNicknameChange]);
  
  const handleSave = useCallback(async () => {
    // 현재 닉네임과 동일한 경우
    if (nickname.trim() === currentNickname) {
      setSaveError(ERROR_MESSAGES.SAME_NICKNAME);
      return;
    }

    // 중복확인이 필요한 경우
    if (nicknameStatus !== 'available') {
      setSaveError(validationError || ERROR_MESSAGES.VALIDATION_REQUIRED);
      return;
    }

    setIsSaving(true);
    setSaveError('');
    
    try {
      await onSave(nickname.trim());
      resetNickname();
    } catch (error: unknown) {
      console.error('닉네임 수정 실패:', error);
      // 서버에서 반환하는 에러 메시지 처리 (타입 안전성 개선)
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage.includes('once per month') || errorMessage.includes('한 달') || errorMessage.includes('한달')) {
          setSaveError(ERROR_MESSAGES.MONTHLY_LIMIT);
        } else if (errorMessage.includes('duplicate') || errorMessage.includes('중복')) {
          setSaveError(ERROR_MESSAGES.DUPLICATE);
        } else {
          setSaveError(errorMessage || ERROR_MESSAGES.DEFAULT);
        }
      } else {
        setSaveError(ERROR_MESSAGES.DEFAULT);
      }
    } finally {
      setIsSaving(false);
    }
  }, [nickname, nicknameStatus, validationError, onSave, resetNickname, currentNickname]);

  // 계산된 값들 (로딩 상태 개선)
  const isLoading = isSaving || isChecking;
  const canSave = nicknameStatus === 'available' && !isLoading && isNicknameChanged;
  const displayError = saveError || validationError;

  return {
    nickname,
    error: displayError,
    isSaving,
    nicknameCheckStatus: nicknameStatus,
    isNicknameChanged,
    canSave,
    handleNicknameChange,
    handleSave,
    resetNickname
  };
}