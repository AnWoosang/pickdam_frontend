'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEmailVerify } from '../../hooks/signup/useEmailVerification';

export function EmailVerifyPage() {
  const router = useRouter();
  const { status, message } = useEmailVerify();

  // 성공 시 자동 리다이렉트
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        router.push('/?login=true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
              <h1 className="text-xl font-bold text-gray-900 mb-4">
                이메일 인증 처리 중...
              </h1>
              <p className="text-gray-600">
                잠시만 기다려주세요.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-2xl font-bold text-green-600 mb-4">
                인증 완료!
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-500">
                3초 후 홈페이지로 이동하여 로그인해주세요...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                인증 실패
              </h1>
              <p className="text-gray-600 mb-4">
                {message}
              </p>

              {/* 추가 안내 메시지 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3 mt-0.5">💡</div>
                  <div className="text-sm">
                    <p className="font-semibold text-blue-800 mb-2">
                      인증 링크가 만료되었나요?
                    </p>
                    <div className="text-blue-700 space-y-1">
                      <p>1. 홈페이지에서 로그인을 시도해주세요</p>
                      <p>2. 로그인 시 이메일 인증이 필요하다는 안내가 나타납니다</p>
                      <p>3. 안내에 따라 인증 메일을 다시 받으실 수 있습니다</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/?login=true')}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 cursor-pointer font-medium"
                >
                  로그인하러 가기
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  홈으로 돌아가기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}