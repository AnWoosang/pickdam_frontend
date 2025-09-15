import React, { useCallback } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/router/routes';

interface SignupPromptProps {
  onClose: () => void;
}

export function SignupPrompt({ onClose }: SignupPromptProps) {
  // 회원가입 링크 클릭 핸들러를 메모이제이션
  const handleSignupClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      <span className="text-gray-400">아직 회원이 아니신가요?</span>
      <Link
        href={ROUTES.AUTH.SIGNUP}
        className="text-black font-bold hover:underline cursor-pointer"
        onClick={handleSignupClick}
      >
        회원가입
      </Link>
    </div>
  );
}