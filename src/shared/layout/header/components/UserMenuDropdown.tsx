"use client";

import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  LogOut,
  User as UserIcon
} from 'lucide-react';

import { ROUTES } from '@/app/router/routes';
import { User } from '@/domains/user/types/user';
import { useLogout } from '@/domains/auth/hooks/useAuthQueries';
import { Button } from '@/shared/components/Button';

interface UserMenuDropdownProps {
  user: User | null;
  isActive: boolean;
  onToggle: () => void;
}

export function UserMenuDropdown({ 
  user,
  isActive, 
  onToggle
}: UserMenuDropdownProps) {
  const router = useRouter();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      onToggle(); // 드롭다운 닫기
    } catch (error) {
      console.error('로그아웃 실패:', error);
      onToggle(); // 실패해도 드롭다운 닫기
    }
  };

  const handleMypageClick = () => {
    router.push(ROUTES.MYPAGE.HOME);
    onToggle(); // 드롭다운 닫기
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center space-x-1 pb-1 transition-colors cursor-pointer
          ${isActive 
            ? 'text-textHeading border-b-2 border-primary' 
            : 'text-gray hover:text-textHeading'
          }`}
      >
        <UserIcon className="w-4 h-4" />
        <span className="text-sm font-semibold">{user?.nickname || user?.name || '사용자'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isActive && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-grayLight 
                      rounded-lg shadow-lg z-50">
          <div className="p-2 space-y-1">
            <Button
              onClick={handleMypageClick}
              variant="ghost"
              size="small"
              className="w-full justify-start text-textDefault hover:text-textHeading"
            >
              마이페이지
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="small"
              className="w-full justify-start text-textDefault hover:text-textHeading"
              icon={<LogOut className="w-4 h-4" />}
            >
              로그아웃
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}