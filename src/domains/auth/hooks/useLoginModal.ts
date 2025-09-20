'use client';

import { useCallback } from 'react';
import { LoginForm, ResendEmailForm } from '@/domains/auth/types/auth';
import { useLogin } from './useAuthQueries';
import { useResendEmail } from './useResendEmail';
import { BusinessError } from '@/shared/error/BusinessError';

interface LoginResult {
  success: boolean;
  error?: {
    message: string;
    code?: string;
    email?: string; // for unverified email case
    details?: string;
  };
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
  handleLogin: (formData: LoginForm) => Promise<LoginResult>;
  handleResendEmail: (email: string) => Promise<ResendResult>;
}

export function useLoginModal(): UseLoginModalReturn {
  const loginMutation = useLogin();
  const { resendEmail, isResending, resendMessage } = useResendEmail();

  // 로그인 처리 (순수 비즈니스 로직만)
  const handleLogin = useCallback(async (formData: LoginForm): Promise<LoginResult> => {
    try {
      await loginMutation.mutateAsync(formData);
      return { success: true };
    } catch (error) {
      // BusinessError 처리
      if (error instanceof BusinessError) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.code,
            email: error.code === 'EMAIL_NOT_VERIFIED' ? formData.email : undefined,
            details: error.details,
          }
        };
      }
      
      // 기타 Error 처리 (fallback)
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      return {
        success: false,
        error: {
          message: errorMessage,
          code: 'UNKNOWN_ERROR',
          email: undefined
        }
      };
    }
  }, [loginMutation]);

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