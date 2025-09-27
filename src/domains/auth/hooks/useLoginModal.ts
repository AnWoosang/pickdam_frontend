'use client';

import { useCallback } from 'react';
import { LoginForm, ResendEmailForm } from '@/domains/auth/types/auth';
import { useLogin } from './useAuthQueries';
import { useResendEmail } from './useResendEmail';
import { BusinessError } from '@/shared/error/BusinessError';

interface LoginCallbacks {
  onSuccess?: () => void;
  onEmailNotVerified?: (email: string) => void;
  onInvalidCredentials?: () => void;
  onError?: (message: string) => void;
}

interface ResendResult {
  success: boolean;
  message: string;
}

interface UseLoginModalReturn {
  // Loading states
  isLoading: boolean;
  isResending: boolean;

  // Actions
  handleLogin: (formData: LoginForm) => Promise<void>;
  handleResendEmail: (email: string) => Promise<ResendResult>;
}

export function useLoginModal(callbacks?: LoginCallbacks): UseLoginModalReturn {
  const loginMutation = useLogin();
  const { resendEmail, isResending, resendMessage } = useResendEmail();

  // 로그인 처리 (순수 비즈니스 로직만)
  const handleLogin = useCallback(async (formData: LoginForm): Promise<void> => {
    try {
      await loginMutation.mutateAsync(formData);
      // 성공 시 콜백 호출
      callbacks?.onSuccess?.();
    } catch (error) {
      if (error instanceof BusinessError) {
        // 에러 코드별로 적절한 콜백 호출
        if (error.code === 'EMAIL_NOT_VERIFIED') {
          callbacks?.onEmailNotVerified?.(formData.email);
        } else if (error.code === 'INVALID_CREDENTIALS') {
          callbacks?.onInvalidCredentials?.();
        } else {
          callbacks?.onError?.(error.message);
        }
        return;
      }

      throw error;
    }
  }, [loginMutation, callbacks]);

  // 이메일 재전송 처리
  const handleResendEmail = useCallback(async (email: string): Promise<ResendResult> => {
    const form: ResendEmailForm = { email, type: 'signup' };
    const success = await resendEmail(form);
    
    return {
      success,
      message: success 
        ? '인증 메일이 다시 발송되었습니다. 이메일을 확인해주세요.'
        : (resendMessage || '메일 발송에 실패했습니다.')
    };
  }, [resendEmail, resendMessage]);

  return {
    // Loading states
    isLoading: loginMutation.isPending,
    isResending,
    
    // Actions
    handleLogin,
    handleResendEmail,
  };
}