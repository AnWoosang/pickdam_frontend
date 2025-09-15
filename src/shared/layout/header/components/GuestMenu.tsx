"use client";

import { useRouter } from 'next/navigation';

import { ROUTES } from '@/app/router/routes';
import { LoginModal } from '@/domains/auth/components/LoginModal';
import { useLoginModalState } from '@/domains/auth/hooks/useLoginModalState';
import { Button } from '@/shared/components/Button';

export function GuestMenu() {
  const router = useRouter();
  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useLoginModalState();

  const handleSignupClick = () => {
    router.push(ROUTES.AUTH.SIGNUP);
  };

  const handleCustomerServiceClick = () => {
    // TODO: 고객센터 페이지 구현
    console.log('고객센터 페이지로 이동');
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
        <span className="text-hintText">|</span>
        <Button
          onClick={handleCustomerServiceClick}
          variant="ghost"
          size="small"
          noFocus
          className="hover:bg-transparent hover:text-gray-600"
        >
          고객센터
        </Button>
      </div>
      
      {/* 로그인 모달 */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
      />
    </>
  );
}