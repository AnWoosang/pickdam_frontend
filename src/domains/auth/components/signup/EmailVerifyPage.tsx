'use client';

import { useRouter } from 'next/navigation';
import { useEmailVerify } from '../../hooks/signup/useEmailVerification';

export function EmailVerifyPage() {
  const router = useRouter();
  const { status, message } = useEmailVerify();

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
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 cursor-pointer"
              >
                홈으로 돌아가기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}