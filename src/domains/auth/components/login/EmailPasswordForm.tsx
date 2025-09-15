import React, { useState, useCallback, useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { validateEmail, validatePassword } from '@/shared/validation/common';
import { convertKoreanToEnglish } from '@/shared/utils/KoreanToEnglish';

interface LoginFormData {
  email: string;
  password: string;
}

interface EmailPasswordFormProps {
  isLoading: boolean;
  onSubmit: (formData: LoginFormData) => void;
}

export function EmailPasswordForm({
  isLoading,
  onSubmit
}: EmailPasswordFormProps) {
  // 내부 상태 관리
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // 입력 핸들러를 메모이제이션
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 비밀번호 필드의 경우 한글을 영어로 자동 변환
    const processedValue = name === 'password' ? convertKoreanToEnglish(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // 입력 시 해당 필드 에러 메시지 초기화
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }, []);

  // 폼 검증을 메모이제이션
  const validateForm = useCallback((): boolean => {
    const newErrors = { email: '', password: '' };
    let hasError = false;

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
      hasError = true;
    } else {
      const emailValidationError = validateEmail(formData.email);
      if (emailValidationError) {
        newErrors.email = emailValidationError;
        hasError = true;
      }
    }

    // 비밀번호 검증
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
      hasError = true;
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
        hasError = true;
      }
    }

    setErrors(newErrors);
    return !hasError;
  }, [formData.email, formData.password]);

  // 폼 제출 핸들러를 메모이제이션
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  }, [validateForm, onSubmit, formData]);

  // 비밀번호 표시/숨김 토글
  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // 입력 필드 클래스명을 메모이제이션
  const inputClassNames = useMemo(() => ({
    email: `w-full h-13 px-4 border-[1px] rounded-lg focus:outline-none text-base placeholder:text-hintText text-black ${
      errors.email
        ? "border-red-500 focus:border-red-500"
        : "border-gray-200 focus:border-black"
    }`,
    password: `w-full h-13 px-4 pr-12 border-[1px] rounded-lg focus:outline-none text-base placeholder:text-hintText text-black ${
      errors.password
        ? "border-red-500 focus:border-red-500"
        : "border-gray-200 focus:border-black"
    }`
  }), [errors.email, errors.password]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={isLoading}
          className={inputClassNames.email}
          placeholder="이메일을 입력해 주세요."
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-3">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            className={inputClassNames.password}
            placeholder="비밀번호를 입력해 주세요."
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
        )}
      </div>

      <Button
        variant="primary"
        type="submit"
        disabled={isLoading}
        className="w-full h-13 mt-1 mb-8"
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}