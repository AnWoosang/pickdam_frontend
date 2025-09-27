'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/Button';
import { useResendEmail } from '@/domains/auth/hooks/useResendEmail';
import { ROUTES } from '@/app/router/routes';
import { ResendEmailForm } from '@/domains/auth/types/auth';

interface SignupCompletePageProps {
  email: string | null;
}

export function SignupCompletePage({ email }: SignupCompletePageProps) {
  const router = useRouter();
  const { isResending, resendMessage, resendEmail } = useResendEmail();

  useEffect(() => {
    // 이메일이 없으면 홈으로 리다이렉트
    if (!email) {
      router.push(ROUTES.HOME);
    }
  }, [email, router]);

  const handleResendEmail = async () => {
    if (!email) return;
    
    const form: ResendEmailForm = { email, type: 'signup' };
    await resendEmail(form);
  };

  const handleGoToLogin = () => {
    router.push('/');
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* 성공 아이콘 */}
          <div className="text-6xl mb-6">🎉</div>
          
          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            회원가입이 완료되었습니다!
          </h1>
          
          {/* 설명 */}
          <div className="text-gray-600 mb-6 space-y-3">
            <p>
              <strong className="text-gray-800">{email}</strong>로<br />
              인증 메일이 발송되었습니다.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <div className="flex items-start">
                <div className="text-yellow-600 mr-3 mt-0.5">⚠️</div>
                <div className="text-sm">
                  <p className="font-semibold text-yellow-800 mb-2">
                    이메일 인증이 필요합니다
                  </p>
                  <p className="text-yellow-700">
                    이메일 인증을 완료해야 픽담의 모든 기능을 정상적으로 이용하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-left space-y-2">
              <p className="font-medium text-gray-700">📧 인증 방법:</p>
              <ol className="text-gray-600 ml-4 space-y-1">
                <li>1. 이메일함을 확인하세요</li>
                <li>2. 픽담에서 보낸 인증 메일을 찾으세요</li>
                <li>3. 메일 안의 &apos;인증하기&apos; 버튼을 클릭하세요</li>
              </ol>
            </div>
            
            <p className="text-xs text-gray-500">
              💡 이메일이 오지 않았다면 스팸함도 확인해보세요
            </p>
          </div>

          {/* 재발송 메시지 */}
          {resendMessage && (
            <div className={`mb-4 p-3 rounded-md ${
              resendMessage.includes('실패') 
                ? 'bg-red-50 border border-red-200 text-red-600' 
                : 'bg-green-50 border border-green-200 text-green-600'
            }`}>
              {resendMessage}
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            <Button
              onClick={() => {
                handleResendEmail();
              }}
              variant="secondary"
              size="medium"
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2"></div>
                  발송 중...
                </>
              ) : (
                '인증 메일 다시 보내기'
              )}
            </Button>
            
            <Button
              onClick={handleGoToLogin}
              variant="primary"
              size="medium"
              className="w-full"
            >
              로그인하러 가기
            </Button>
          </div>
          
          {/* 추가 안내 */}
          <div className="mt-6 text-xs text-gray-500">
            <p>인증 후에는 바로 로그인하실 수 있습니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}