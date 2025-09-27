'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/shared/components/Button';
import { PasswordField } from '@/domains/auth/components/form/PasswordField';
import { ROUTES } from '@/app/router/routes';
import { useResetPassword } from '@/domains/auth/hooks/useAuthQueries';
import { checkPasswordStrength } from '@/shared/validation/common';
import { BusinessError } from '@/shared/error/BusinessError';
import { ApiErrorCode } from '@/shared/error/errorCodes';

interface ResetPasswordPageProps {
  className?: string;
}

export function ResetPasswordPage({ className = '' }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 코드 확인 및 세션 설정
  useEffect(() => {
    const verifyAndSetSession = async () => {
      const code = searchParams.get('code');

      if (!code) {
        toast.error('유효하지 않은 링크입니다.');
        router.push(ROUTES.AUTH.FIND_PASSWORD);
        return;
      }
    };

    verifyAndSetSession();
  }, [searchParams, router]);

  const resetPasswordMutation = useResetPassword({
    onSuccess: () => {
      setIsPasswordReset(true);
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
    },
    onError: (error) => {
      if (error instanceof BusinessError && error.code === ApiErrorCode.SAME_PASSWORD) {
        toast.error('새 비밀번호는 이전 비밀번호와 달라야 합니다.');
      } else {
        toast.error('비밀번호 변경 중 오류가 발생했습니다.');
      }
    }
  });

  const validateForm = () => {
    let isValid = true;

    // 비밀번호 검증
    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    } else {
      const passwordStrength = checkPasswordStrength(password);
      if (passwordStrength.strength < 2) {
        setPasswordError('비밀번호가 너무 약합니다. 영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요.');
        isValid = false;
      } else {
        setPasswordError('');
      }
    }

    // 비밀번호 확인 검증
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('비밀번호 확인을 입력해주세요.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    resetPasswordMutation.mutate({
      password: password.trim(),
      confirmPassword: confirmPassword.trim()
    });
  };

  const isLoading = resetPasswordMutation.isPending;

  if (isPasswordReset) {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        <div className="bg-white rounded-lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              비밀번호 변경 완료
            </h2>
            <p className="text-gray-600 mb-6">
              비밀번호가 성공적으로 변경되었습니다.<br />
              새로운 비밀번호로 로그인해주세요.
            </p>

            <Button
              onClick={() => router.push(ROUTES.HOME)}
              variant="primary"
              size="medium"
              className="w-full"
            >
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-lg">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">비밀번호 재설정</h1>
          <p className="text-gray-600">
            새로운 비밀번호를 입력해주세요.
          </p>
        </div>

        {/* 비밀번호 재설정 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            disabled={isLoading}
            showStrength={true}
            label="새 비밀번호"
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            id="password"
            name="password"
          />

          <PasswordField
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPasswordError}
            disabled={isLoading}
            showStrength={false}
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해주세요"
            id="confirmPassword"
            name="confirmPassword"
          />

          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                변경 중...
              </>
            ) : (
              '비밀번호 변경'
            )}
          </Button>
        </form>

      </div>
    </div>
  );
}