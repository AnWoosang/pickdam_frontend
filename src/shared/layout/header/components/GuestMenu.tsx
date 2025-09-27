"use client";

import { useRouter } from 'next/navigation';

import { ROUTES } from '@/app/router/routes';
import { useUIStore } from '@/domains/auth/store/authStore';
import { Button } from '@/shared/components/Button';

export function GuestMenu() {
  const router = useRouter();
  const { openLoginModal } = useUIStore();

  const handleSignupClick = () => {
    router.push(ROUTES.AUTH.SIGNUP);
  };


  return (
    <>
      <div className="flex items-center gap-0">
        <Button
          onClick={openLoginModal}
          variant="ghost"
          size="small"
          noFocus
          className="hover:bg-transparent hover:text-gray-600"
        >
          로그인
        </Button>
        <span className="text-hintText">|</span>
        <Button
          onClick={handleSignupClick}
          variant="ghost"
          size="small"
          noFocus
          className="hover:bg-transparent hover:text-gray-600"
        >
          회원가입
        </Button>
      </div>
    </>
  );
}