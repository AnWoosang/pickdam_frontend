'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/shared/api/axiosClient';
import { ROUTES } from '@/app/router/routes';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🚀 이메일 인증 콜백 처리 시작');
        
        setStatus('loading');
        setMessage('이메일 인증 처리 중...');
        
        // URL 파라미터에서 토큰 추출 (현재 URL에서)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const type = urlParams.get('type');
        
        if (!token || type !== 'signup') {
          throw new Error('유효하지 않은 인증 링크입니다.');
        }
        
        // API Routes를 통해 이메일 인증 처리
        const response: { message?: string } = await apiClient.post('/auth/verify-email', {
          token,
          type
        });

        setStatus('success');
        setMessage(response.message || '이메일 인증이 완료되었습니다! 이제 로그인해주세요.');

        // 3초 후 로그인 페이지로 리다이렉트 (인증 완료 후 로그인을 위해)
        setTimeout(() => {
            router.push(`${ROUTES.HOME}?login=true`);
        }, 3000);

      } catch (error) {
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : '인증 처리 중 오류가 발생했습니다.';
        setMessage(errorMessage);
        
        // 오류 시에도 5초 후 홈페이지로 리다이렉트
        setTimeout(() => {
          router.push(ROUTES.HOME);
        }, 5000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                이메일 인증 처리 중...
              </h2>
              <p className="text-gray-600">잠시만 기다려주세요.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-xl font-semibold text-green-600 mb-2">
                회원가입 완료!
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="text-sm text-gray-500">
                픽담과 함께 최고의 전자담배를 찾아보세요
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                인증 실패
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                회원가입 다시하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}