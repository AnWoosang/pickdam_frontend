import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/shared/components/Button';
import { validateEmail, validatePassword } from '@/shared/validation/common';
import { PasswordField } from '@/domains/auth/components/form/PasswordField';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  isLoading: boolean;
  onSubmit: (formData: LoginFormData) => void;
  hasCredentialError?: boolean; // 로그인 실패 시 입력란 빨간색 표시용
  onChange?: (formData: LoginFormData) => void; // 입력 변경 시 콜백
}

export function LoginForm({
  isLoading,
  onSubmit,
  hasCredentialError = false,
  onChange
}: LoginFormProps) {
  // 내부 상태 관리
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // 입력 핸들러를 메모이제이션
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newFormData = {
      ...formData,
      [name]: value
    };

    setFormData(newFormData);

    // 입력 시 해당 필드 에러 메시지 초기화
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // 부모 컴포넌트에 변경 사항 알림 (credential 에러 초기화용)
    onChange?.(newFormData);
  }, [formData, onChange]);

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

  // 입력 필드 클래스명을 메모이제이션
  const inputClassNames = useMemo(() => ({
    email: `w-full h-13 px-4 border-[1px] rounded-lg focus:outline-none text-base placeholder:text-hintText text-black ${
      errors.email || hasCredentialError
        ? "border-red-500 focus:border-red-500"
        : "border-gray-200 focus:border-black"
    }`,
    password: `w-full h-13 px-4 pr-12 border-[1px] rounded-lg focus:outline-none text-base placeholder:text-hintText text-black ${
      errors.password || hasCredentialError
        ? "border-red-500 focus:border-red-500"
        : "border-gray-200 focus:border-black"
    }`
  }), [errors.email, errors.password, hasCredentialError]);

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
        <PasswordField
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          disabled={isLoading}
          placeholder="비밀번호를 입력해 주세요."
          name="password"
          id="password"
          hideLabel={true}
          className={inputClassNames.password}
        />
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