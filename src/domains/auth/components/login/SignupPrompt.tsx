import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/router/routes';

interface SignupPromptProps {
  onClose: () => void;
}

export function SignupPrompt({ onClose }: SignupPromptProps) {
  const router = useRouter();

  // 회원가입 링크 클릭 핸들러를 메모이제이션
  const handleSignupClick = useCallback(() => {
    onClose();
    router.push(ROUTES.AUTH.SIGNUP);
  }, [onClose, router]);

  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      <span className="text-gray-400">아직 회원이 아니신가요?</span>
      <button
        onClick={handleSignupClick}
        className="text-black font-bold hover:underline cursor-pointer"
      >
        회원가입
      </button>
    </div>
  );
}