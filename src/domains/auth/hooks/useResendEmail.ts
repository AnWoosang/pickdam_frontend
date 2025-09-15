'use client';

import { useState, useCallback } from 'react';
import { useResendEmailMutation } from './signup/useSignupQueries';
import { ResendEmailForm } from '@/domains/auth/types/auth';

interface UseResendEmailReturn {
  isResending: boolean;
  resendMessage: string;
  resendEmail: (form: ResendEmailForm) => Promise<boolean>;
  clearMessage: () => void;
}

export function useResendEmail(): UseResendEmailReturn {
  const [resendMessage, setResendMessage] = useState('');
  const resendEmailMutation = useResendEmailMutation();

  const resendEmail = useCallback(async (form: ResendEmailForm): Promise<boolean> => {
    if (!form.email) {
      setResendMessage('이메일 주소가 필요합니다.');
      return false;
    }
    
    setResendMessage('');

    try {
      const _response = await resendEmailMutation.mutateAsync(form);
      setResendMessage('인증 메일이 다시 발송되었습니다. 이메일을 확인해주세요.');
      return true;
    } catch (error) {
      setResendMessage(error instanceof Error ? error.message : '메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      return false;
    }
  }, [resendEmailMutation]);

  const clearMessage = useCallback(() => {
    setResendMessage('');
  }, []);

  return {
    isResending: resendEmailMutation.isPending,
    resendMessage,
    resendEmail,
    clearMessage
  };
}