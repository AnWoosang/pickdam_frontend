'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { FormField } from '@/shared/components/FormField';
import { checkPasswordStrength } from '@/shared/validation/common';
import { convertKoreanToEnglish } from '@/shared/utils/KoreanToEnglish';
import { PasswordFieldProps } from '../../types/password';

export function PasswordField({ 
  value, 
  onChange, 
  error, 
  disabled = false,
  showStrength = false,
  label = '비밀번호',
  placeholder = '영문, 숫자 , 특수문자 포함 8자 이상',
  name = 'password',
  id = 'password'
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  // 비밀번호 강도 계산을 메모이제이션
  const passwordStrength = useMemo(() => {
    return checkPasswordStrength(value);
  }, [value]);

  // 한글 입력 시 영어로 자동 변환하는 핸들러
  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const convertedValue = convertKoreanToEnglish(inputValue);
    
    // 변환된 값으로 이벤트 객체 수정
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: convertedValue,
        name: e.target.name
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  }, [onChange]);

  // 비밀번호 표시/숨김 토글
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // 입력 필드 스타일
  const inputClassName = useMemo(() => {
    return `w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400  
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
            disabled:bg-gray-50 disabled:text-gray-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`;
  }, [error]);

  return (
    <FormField
      label={label}
      icon={<Lock className="w-4 h-4" />}
      required
      error={error}
    >
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={handlePasswordChange}
          disabled={disabled}
          className={inputClassName}
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="ghost"
          size="small"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center p-0 h-auto cursor-pointer"
          icon={showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        />
      </div>
      
      {/* 비밀번호 강도 표시 */}
      {showStrength && value && (
        <div className="mt-2">
          <div className="flex space-x-1 mb-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 w-1/4 rounded ${
                  level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600">
            {passwordStrength.text && `강도: ${passwordStrength.text}`}
            {passwordStrength.requirements.length > 0 && 
              ` (${passwordStrength.requirements.join(', ')} 포함)`
            }
          </p>
        </div>
      )}
    </FormField>
  );
}