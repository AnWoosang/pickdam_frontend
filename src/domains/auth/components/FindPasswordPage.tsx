'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/shared/components/Button';
import { FormField } from '@/shared/components/FormField';
import { ROUTES } from '@/app/router/routes';
import { useUIStore } from '@/domains/auth/store/authStore';
import { useFindPassword } from '@/domains/auth/hooks/useAuthQueries';

interface FindPasswordPageProps {
  className?: string;
}

export function FindPasswordPage({ className = '' }: FindPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { openLoginModal } = useUIStore();

  const findPasswordMutation = useFindPassword({
    onSuccess: () => {
      setIsEmailSent(true);
      toast.success('비밀번호 재설정 이메일을 발송했습니다.');
    },
    onError: () => {
      toast.error('비밀번호 재설정 요청 중 오류가 발생했습니다.');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    findPasswordMutation.mutate({ email: email.trim() });
  };

  const isLoading = findPasswordMutation.isPending;

  if (isEmailSent) {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        <div className="bg-white rounded-lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              이메일을 확인해주세요
            </h2>
            <p className="text-gray-600 mb-6">
              <span className="font-medium">{email}</span>로<br />
              비밀번호 재설정 링크를 발송했습니다.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              이메일을 받지 못했다면 스팸함을 확인하거나<br />
              몇 분 후 다시 시도해주세요.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
                variant="secondary"
                size="medium"
                className="w-full"
              >
                다른 이메일로 재시도
              </Button>
              <Link href={ROUTES.HOME}>
                <Button
                  variant="ghost"
                  size="medium"
                  className="w-full"
                >
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">비밀번호 찾기</h1>
          <p className="text-gray-600">
            가입 시 사용한 이메일을 입력하시면<br />
            비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>

        {/* 비밀번호 찾기 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="이메일"
            icon={<Mail className="w-4 h-4" />}
            required
          >
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="example@email.com"
            />
          </FormField>

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
                발송 중...
              </>
            ) : (
              '비밀번호 재설정 이메일 발송'
            )}
          </Button>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            계정이 기억나셨나요?{' '}
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={openLoginModal}
              className="font-medium text-primary hover:underline p-0 h-auto"
            >
              로그인
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}