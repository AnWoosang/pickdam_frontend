'use client';

import { useState } from 'react';
import { SignupFormData, SignupResponse, SignupError, SignupStatus, EmailVerificationStatus } from '@/types/signup';
import { validateEmail, validatePassword } from '@/constants/signup-mock-data';

interface UseSignupReturn {
  status: SignupStatus;
  error: string | null;
  isLoading: boolean;
  emailVerification: {
    status: EmailVerificationStatus;
    expiresAt: string | null;
    attempts: number;
  };
  signup: (data: SignupFormData) => Promise<SignupResponse>;
  sendEmailVerification: (email: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  checkEmailAvailability: (email: string) => Promise<boolean>;
  resetSignup: () => void;
}

// Mock API 지연시간 시뮬레이션
const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useSignup(): UseSignupReturn {
  const [status, setStatus] = useState<SignupStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [emailVerification, setEmailVerification] = useState({
    status: 'pending' as EmailVerificationStatus,
    expiresAt: null as string | null,
    attempts: 0,
  });

  const isLoading = status === 'submitting' || status === 'validating';

  // 회원가입 처리
  const signup = async (data: SignupFormData): Promise<SignupResponse> => {
    setStatus('submitting');
    setError(null);

    try {
      // Mock API 호출
      await mockApiDelay(2000);

      // Mock 응답 (실제로는 서버 API 응답)
      const response: SignupResponse = {
        user: {
          id: `user_${Date.now()}`,
          email: data.email,
          name: data.name,
          createdAt: new Date().toISOString(),
        },
        token: `mock_token_${Date.now()}`,
        message: '회원가입이 완료되었습니다.',
      };

      setStatus('success');
      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '회원가입에 실패했습니다.';
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  };

  // 이메일 인증코드 발송
  const sendEmailVerification = async (email: string): Promise<void> => {
    setStatus('validating');
    setError(null);

    try {
      // 이메일 형식 검증
      if (!validateEmail(email)) {
        throw new Error('올바른 이메일 형식을 입력해주세요.');
      }

      // Mock API 호출
      await mockApiDelay(1500);

      // 인증코드 만료 시간 설정 (5분)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      setEmailVerification({
        status: 'sent',
        expiresAt,
        attempts: 0,
      });
      
      setStatus('idle');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '인증코드 발송에 실패했습니다.';
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  };

  // 이메일 인증코드 확인
  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    setStatus('validating');
    setError(null);

    try {
      // Mock API 호출
      await mockApiDelay(1000);

      // Mock 인증코드 (실제로는 서버에서 검증)
      const validCodes = ['123456', '000000']; // 테스트용 코드
      
      if (!validCodes.includes(code)) {
        setEmailVerification(prev => ({
          ...prev,
          attempts: prev.attempts + 1,
        }));
        
        if (emailVerification.attempts >= 4) { // 5회 시도 후 만료
          setEmailVerification(prev => ({
            ...prev,
            status: 'expired',
          }));
          throw new Error('인증 시도 횟수를 초과했습니다. 다시 시도해주세요.');
        }
        
        throw new Error('인증코드가 올바르지 않습니다.');
      }

      // 만료 시간 확인
      if (emailVerification.expiresAt && new Date() > new Date(emailVerification.expiresAt)) {
        setEmailVerification(prev => ({
          ...prev,
          status: 'expired',
        }));
        throw new Error('인증코드가 만료되었습니다.');
      }

      setEmailVerification(prev => ({
        ...prev,
        status: 'verified',
      }));
      
      setStatus('idle');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이메일 인증에 실패했습니다.';
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  };

  // 이메일 중복 확인
  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    setStatus('validating');
    setError(null);

    try {
      if (!validateEmail(email)) {
        throw new Error('올바른 이메일 형식을 입력해주세요.');
      }

      // Mock API 호출
      await mockApiDelay(1000);

      // Mock 중복 확인 (실제로는 서버에서 확인)
      const existingEmails = ['test@example.com', 'admin@pickdam.com']; // 테스트용 기존 이메일
      const isAvailable = !existingEmails.includes(email.toLowerCase());

      if (!isAvailable) {
        throw new Error('이미 사용중인 이메일입니다.');
      }

      setStatus('idle');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이메일 확인에 실패했습니다.';
      setError(errorMessage);
      setStatus('error');
      return false;
    }
  };

  // 회원가입 상태 초기화
  const resetSignup = () => {
    setStatus('idle');
    setError(null);
    setEmailVerification({
      status: 'pending',
      expiresAt: null,
      attempts: 0,
    });
  };

  return {
    status,
    error,
    isLoading,
    emailVerification,
    signup,
    sendEmailVerification,
    verifyEmail,
    checkEmailAvailability,
    resetSignup,
  };
}