import React, { memo } from 'react';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  onLogout: () => void;
  isLoggingOut: boolean;
}

export const LogoutButton = memo<LogoutButtonProps>(function LogoutButton({ onLogout, isLoggingOut }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <button
        onClick={onLogout}
        disabled={isLoggingOut}
        className="flex items-center justify-center w-full space-x-2 p-3 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">
          {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
        </span>
      </button>
    </div>
  );
});