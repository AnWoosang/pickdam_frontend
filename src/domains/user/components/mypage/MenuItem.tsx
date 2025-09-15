import React from 'react';
import Link from 'next/link';
import { ChevronRight, Heart, FileText, Edit3, MessageSquare, Shield, Settings, ThumbsUp, MessageCircle, UserX, LogOut } from 'lucide-react';
import { MypageMenuItem } from '@/domains/user/components/mypage/MypagePage';

// 아이콘 컴포넌트 매핑
const iconComponents = {
  Heart,
  Edit3,
  MessageSquare,
  FileText,
  Shield,
  Settings,
  ThumbsUp,
  MessageCircle,
  UserX,
  LogOut,
};

interface MenuItemProps {
  item: MypageMenuItem;
  badgeCount?: number;
  isLoading?: boolean;
  onAction?: () => void;
}

export const MenuItem = React.memo(({ item, badgeCount, isLoading, onAction }: MenuItemProps) => {
  const IconComponent = iconComponents[item.icon as keyof typeof iconComponents];
  
  const content = (
    <>
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
          <IconComponent className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{item.label}</span>
          {item.isNew && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
              NEW
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* 카운트를 오른쪽 끝에 표시 */}
        {!isLoading && badgeCount && badgeCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-medium bg-primary text-white">
            {badgeCount}
          </span>
        )}
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </>
  );

  if (item.isAction && onAction) {
    return (
      <button
        onClick={onAction}
        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-colors hover:shadow-md w-full text-left cursor-pointer"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-colors hover:shadow-md cursor-pointer"
    >
      {content}
    </Link>
  );
});

MenuItem.displayName = 'MenuItem';