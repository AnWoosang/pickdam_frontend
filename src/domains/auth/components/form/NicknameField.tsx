'use client';
import React, { useCallback, useEffect, useMemo } from 'react';
import { User, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { FormField } from '@/shared/components/FormField';
import { useNicknameCheck } from '@/shared/hooks/useNicknameCheck';

// 닉네임 필드 Props
export interface NicknameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidChange: (nickname: string, isValid: boolean) => void;
  disabled?: boolean;
}

export function NicknameField({ 
  value, 
  onChange, 
  onValidChange, 
  disabled = false 
}: NicknameFieldProps) {
  const {
    validationResult: { status, error, isValid, canCheck },
    isChecking,
    handleNicknameChange,
    handleCheckDuplicate,
    resetStatus,
  } = useNicknameCheck();

  // 외부 value와 내부 상태 동기화
  useEffect(() => {
    handleNicknameChange(value);
  }, [value, handleNicknameChange]);

  // 검증 결과를 외부로 전달
  useEffect(() => {
    onValidChange(value, isValid);
  }, [value, isValid, onValidChange]);

  // 입력 변경 핸들러
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    resetStatus();
  }, [onChange, resetStatus]);

  // 상태 기반 UI 설정을 메모이제이션
  const statusConfig = useMemo(() => ({
    borderColor: error ? 'border-red-300' : 
                 status === 'available' ? 'border-primary text-primary' : 
                 'border-gray-300',
    showSuccessMessage: status === 'available' && !error
  }), [error, status]);

  // 상태 아이콘 렌더링을 메모이제이션
  const statusIcon = useMemo(() => {
    switch (status) {
      case 'checking':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary"></div>;
      case 'available':
        return <Check className="h-4 w-4 text-primary" />;
      case 'duplicate':
        return <X className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  }, [status]);

  return (
    <FormField
      label="닉네임"
      icon={<User className="w-4 h-4" />}
      required
      error={error}
    >
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                       disabled:bg-gray-50 disabled:text-gray-500 ${statusConfig.borderColor}`}
            placeholder="닉네임을 입력하세요 (2-10자)"
          />
          
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {statusIcon}
          </div>
        </div>
        
        <Button
          type="button"
          variant="primary"
          size="small"
          onClick={() => handleCheckDuplicate(value.trim())}
          disabled={disabled || isChecking || !canCheck || value.trim() === ''}
          className="whitespace-nowrap"
        >
          {isChecking ? '확인 중...' : '중복확인'}
        </Button>
      </div>
      
      {statusConfig.showSuccessMessage && (
        <p className="mt-1 text-sm text-primary">사용 가능한 닉네임입니다.</p>
      )}
    </FormField>
  );
}