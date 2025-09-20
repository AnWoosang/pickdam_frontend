import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/router/routes';

interface RememberMeSectionProps {
  onClose: () => void;
  onRememberMeChange?: (checked: boolean) => void; // optional callback
}

export function RememberMeSection({
  onClose,
  onRememberMeChange
}: RememberMeSectionProps) {
  // 내부 상태 관리
  const [rememberMe, setRememberMe] = useState(false);

  // 컴포넌트 마운트 시 localStorage에서 값 읽기
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(savedRememberMe);
  }, []);

  // 상태 변경 핸들러를 메모이제이션
  const handleRememberMeChange = useCallback((checked: boolean) => {
    setRememberMe(checked);
    // localStorage에 저장
    localStorage.setItem('rememberMe', checked.toString());
    onRememberMeChange?.(checked);
  }, [onRememberMeChange]);

  // 체크박스 변경 핸들러를 메모이제이션
  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleRememberMeChange(e.target.checked);
  }, [handleRememberMeChange]);

  return (
    <div className="flex items-center justify-between mb-10">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          name="rememberMe"
          checked={rememberMe}
          onChange={handleCheckboxChange}
          className="accent-primary w-4 h-4 rounded border-gray-300 text-gray"
        />
        <span className="text-gray text-sm font-medium">로그인 유지</span>
      </label>
      <Link
        href={ROUTES.AUTH.RESET_PASSWORD}
        className="text-sm text-gray hover:underline cursor-pointer"
        onClick={onClose}
      >
        아이디/비밀번호 찾기
      </Link>
    </div>
  );
}